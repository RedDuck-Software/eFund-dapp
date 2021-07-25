import { ethers, utils, BigNumber } from "ethers";
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
    return this.currentProvider;
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

  async getFundDeposits(address) {
    const fundContract = this.getFundContractInstance(address);

    return await fundContract.getAllDeposits();
  }

  async getERC20TokenDetails(tokenAddress, amount, fundAddress) {
    const token = this.getERC20ContractInstance(tokenAddress);
    
    const dec = await token.decimals();

    return {
      address: tokenAddress,
      name: await token.symbol(),
      amount: ethers.utils.formatUnits(amount ? amount : await token.balanceOf(fundAddress), dec),
      decimals : dec,
    };
  }

  async getPlatformSettings() {
    const res = await this.platformContract.getPlatformData();

    return {
      softCap: parseFloat(utils.formatEther(res._softCap)),
      hardCap: parseFloat(utils.formatEther(res._hardCap)),
      minimumTimeUntillFundStart: parseFloat(res._minimumTimeUntillFundStart),
      maximumTimeUntillFundStart: parseFloat(res._maximumTimeUntillFundStart),
      minimumProfitFee: parseFloat(res._minimumProfitFee),
      maximumProfitFee: parseFloat(res._maximumProfitFee),
    }
  }

  async getPricesPath(routerAddress, amount: BigNumber, path: string[], overrides) {
    if (amount.isZero()) {
      return new Array(path.length).fill(BigNumber.from([0]));
    } else {
      const contract = await this.getSwapRouterContractInstance(routerAddress);
      const res = await contract.getAmountsOut(amount, path, overrides);
      return res;
    }
  }

  async makeDeposit(fundAddress, amount: BigNumber) {
    const fundContract = this.getFundContractInstance(fundAddress);

    return await fundContract.makeDeposit({ value: amount });
  }

  async getFundDetailedInfo(address) {
    // const platformContract = this.platformContract;
    const fundContract = this.getFundContractInstance(address);


    console.log("current provider ", this.getCurrentProvider());

    // @ts-ignore: cannot assign vm to Event for some reasone
    const signerAddress = await this.getCurrentProvider()
      // @ts-ignore: cannot assign vm to Event for some reasone
      .getSigner()
      // @ts-ignore: cannot assign vm to Event for some reasone
      .getAddress();

    const [fundInfo, isDepositsWithdrawed, allowedTokensAddresses, boughtTokensAddresses, deposits, swapHistory, fundCreatedAt] = await Promise.all([
      this.getFundDetails(address),
      fundContract.isDepositsWithdrawed(),
      fundContract.getAllowedTokensAddresses(),
      fundContract.getBoughtTokensAddresses(),
      fundContract.getAllDeposits(),
      fundContract.getAllSwaps(),
      fundContract.fundCreatedAt(),
    ]);

    return {
      ...fundInfo,
      fundCreatedAt: parseFloat(fundCreatedAt),
      isDepositsWithdrawed: isDepositsWithdrawed,
      isManager: fundInfo.managerAddress == signerAddress,
      allowedTokensAddresses: allowedTokensAddresses,
      boughtTokensAddresses: boughtTokensAddresses,
      deposits: deposits.map(d => { return { amount: parseFloat(utils.formatEther(d.depositAmount)), owner: d.depositOwner } }),
      swaps: swapHistory,
      baseBalance: fundInfo.status == 'Opened' ? null :
        parseFloat(utils.formatEther(await fundContract.baseBalance())),
      endBalance: fundInfo.status == 'Opened' || fundInfo.status == 'Active' ? null :
        parseFloat(utils.formatEther(await fundContract.endBalance())),
    };
  }

  async getAllManagerFunds() {
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

    const info = await fundContract.getFundInfo();

    return {
      fundDurationInMonths: parseFloat(info._fundDurationInMonths),
      managerAddress: info._fundManager,
      address: fundContract.address,
      fundStartTimestamp: parseFloat(info._fundStartTimestamp),
      minDepositAmount: parseFloat(utils.formatEther(info._minDepositAmount)),
      fundCanBeStartedAt: parseFloat(info._fundCanBeStartedAt),
      status: fundStatuses[info._fundStatus].value,
      hardCap: parseFloat(utils.formatEther(info._hardCap)),
      softCap: parseFloat(utils.formatEther(info._softCap)),
      profitFee: parseFloat(info._profitFee),
      collateral: parseFloat(utils.formatEther(info._managerCollateral)),
      balance: parseFloat(utils.formatEther(info._currentBalance)),
      investorsAmount: parseFloat(info._investorsAmount),
      title: "Test fund",
      author: "Ben Thomson",
      imgUrl: "real_url_here",
      // todo : fetch fund info from backend
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
