import { ethers, utils } from "ethers";
import { currentProvider, getSigner } from "./ether";
import {
  fundStatuses,
  FUND_ABI,
  FUND_PLATFORM_ABI,
  ERC20_ABI,
  SWAP_ROUTER_ABI,
  SWAP_FACTORY_ABI,
  SWAP_PAIR_ABI,
  ZERO_ADDRESS,
} from "../constants";

function arrayInsertBefore(arr, index, value) {
  return arr.slice(index, 0, value);
}
export class FundService {
  fundPlatfromAddress;

  currentProvider;

  platformContract;

  constructor(fundPlatfromAddress: string, provider) {
    this.fundPlatfromAddress = fundPlatfromAddress;
    this.currentProvider = provider;
    this.platformContract = new ethers.Contract(
      this.fundPlatfromAddress,
      FUND_PLATFORM_ABI,
      this.currentProvider.getSigner()
    );
  }

  getCurrentProvider() {
    return currentProvider;
  }

  getFundPlatformContractInstance() {
    return this.platformContract; // new ethers.Contract(this.fundPlatfromAddress, FUND_PLATFORM_ABI, this.currentProvider.getSigner());
  }

  getFundContractInstance(address) {
    return new ethers.Contract(address, FUND_ABI, this.currentProvider.getSigner());
  }

  getERC20ContractInstance(address) {
    return new ethers.Contract(address, ERC20_ABI, this.currentProvider.getSigner());
  }

  getSwapRouterContractInstance(address) {
    return new ethers.Contract(address, SWAP_ROUTER_ABI, this.currentProvider.getSigner());
  }

  getSwapFactoryContractInstance(address) {
    return new ethers.Contract(address, SWAP_FACTORY_ABI, this.currentProvider.getSigner());
  }

  getSwapPairContractInstance(address: string) {
    return new ethers.Contract(address, SWAP_PAIR_ABI, this.currentProvider.getSigner());
  }

  async getSwapFactoryAddress(swapRouterAddress) {
    const router = this.getSwapRouterContractInstance(swapRouterAddress);

    return await router.factory();
  }

  async getFundSwapsHistory(address) {
    const fundContract = this.getFundContractInstance(address);

    return await fundContract.getAllSwaps();
  }

  async getFundDetailedInfo(address) {
    // const platformContract = this.platformContract;
    const fundContract = this.getFundContractInstance(address);

    // @ts-ignore: cannot assign vm to Event for some reasone
    const signerAddress = await this.getCurrentProvider()
      // @ts-ignore: cannot assign vm to Event for some reasone
      .getSigner()
      // @ts-ignore: cannot assign vm to Event for some reasone
      .getAddress();

    const [fundInfo, allowedTokensAddresses, boughtTokensAddresses] = await Promise.all([
      this.getFundDetails(address),
      fundContract.getAllowedTokensAddresses(),
      fundContract.getBoughtTokensAddresses(),
    ]);

    return {
      ...fundInfo,
      isManager: fundInfo.managerAddress == signerAddress,
      allowedTokensAddresses: allowedTokensAddresses,
      boughtTokensAddresses: boughtTokensAddresses,
    };
  }

  async getAllFunds() {
    const data = (await this.platformContract.getAllFunds()).filter(f => f.toLowerCase() != ZERO_ADDRESS.toLowerCase());

    console.log(data);

    return await Promise.all(
      data
        .slice()
        .reverse()
        .map(async addr => {
          return await this.getFundDetails(addr);
        })
    );
  }

  async getTopFunds(count) {
    const data = await this.platformContract.getTopRelevantFunds(count);

    return await Promise.all(
      data
        .slice()
        .reverse()
        .map(async addr => {
          return await this.getFundDetails(addr);
        })
    );
  }

  async getFundDetails(fundAddress: string) {
    const fundContract = this.getFundContractInstance(fundAddress);

    // const [managerCollateral] = await Promise.all([fundContract.managerCollateral()]);

    /* bool _isDepositsWithdrawed,
            address _fundManager,
            uint256 _fundStartTimestamp,
            uint256 _minDepositAmount,
            uint256 _fundCanBeStartedAt,
            uint256 _profitFee,
            FundStatus _fundStatus,
            uint256 _currentBalance,
            uint256 _managerCollateral,
            uint256 _hardCap,
            uint256 _softCap
     
     */

    const info = await fundContract.getFundInfo();

    console.log("fund info: ", info);

    return {
      isDepositsWithdrawed: info._isDepositsWithdrawed,
      managerAddress: info._fundManager,
      address: fundContract.address,
      fundStartTimestamp: info._fundStartTimestamp,
      minDepositAmount: info._minDepositAmount,
      fundCanBeStartedAt: info._fundCanBeStartedAt,
      status: fundStatuses[info._fundStatus].value,
      hardCap: parseFloat(utils.formatEther(info._hardCap)),
      softCap: parseFloat(utils.formatEther(info._softCap)),
      profitFee: info._profitFee,
      collateral: info._managerCollateral,
      balance: parseFloat(utils.formatEther(info._currentBalance)),
      title: "Test fund",
      author: "Ben Thomson",
      imgUrl: "https://memepedia.ru/wp-content/uploads/2021/02/aboba-aboba-4.jpg",
    };
  }

  // erc20 balance of
  async balanceOfFormatted(tokenAddress, of) {
    const contract = this.getERC20ContractInstance(tokenAddress);
    return utils.formatUnits(await contract.balanceOf(of), await contract.decimals());
  }

  // balance in ETH|BNB
  async getBalanceFormatted(of) {
    return utils.formatEther(await this.currentProvider.getBalance(of));
  }

  async findOptimalPathForSwap(tokenFrom, tokenTo, availableTokens, factoryAddress) {
    console.log("factory address: ", factoryAddress);

    const factory = this.getSwapFactoryContractInstance(factoryAddress);

    const path = [tokenFrom, tokenTo];

    console.log(JSON.stringify(path));

    if (await this.isPathExists(path, factory)) {
      return path;
    }

    for (let i = 0; i < availableTokens.length; i++) {
      let curPath = path.slice();

      curPath = arrayInsertBefore(path, curPath.length - 1, availableTokens[i]);

      if (await this.isPathExists(curPath, factory)) return curPath;
    }

    return null;
  }

  async isPathExists(path, factory) {
    for (let i = 0; i < path.length - 1; i++) {
      const pair = await factory.getPair(path[i], path[i + 1]);

      if (pair == ZERO_ADDRESS) return false;
    }
    return true;
  }
}
