import { ethers, utils, BigNumber } from "ethers";
import { currentProvider, getSigner } from "./ether";
import { getFundInfoByAddress, getUserByAddress, findLogoByAddress } from "./helpers";
import { DEFAULT_IMG_URL } from "../constants";

import {
  fundStatuses,
  FUND_ABI,
  FUND_PLATFORM_ABI,
  ERC20_ABI,
  SWAP_ROUTER_ABI,
  SWAP_FACTORY_ABI,
  SWAP_PAIR_ABI,
  ZERO_ADDRESS,
  eFundNetworkSettings,
} from "../constants";

function arrayInsertBefore(arr, index, value) {
  return arr.slice(index, 0, value);
}
export class FundService {
  fundPlatfromAddress;

  currentProvider;

  platformContract;

  networkSettings;

  constructor(networkSettings, provider) {
    this.networkSettings = networkSettings;
    this.fundPlatfromAddress = networkSettings.eFundPlatformAddress;
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

  getLogoByAddress(address) {
    return findLogoByAddress(this.networkSettings.chainId, address);
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

  async getTokenPriceInETH(address, amount) {
    return parseFloat(
      utils.formatEther(
        (
          await this.getPricesPath(
            this.networkSettings.router, // todo : fetch router from contract
            amount,
            [address, this.networkSettings.wrappedCryptoAddress],
            undefined
          )
        )[1]
      )
    );
  }

  async getERC20TokenDetails(tokenAddress, amount, fundAddress) {
    const token = this.getERC20ContractInstance(tokenAddress);

    const dec = await token.decimals();

    const f = Object.keys(eFundNetworkSettings).filter(
      k => eFundNetworkSettings[k].eFundPlatformAddress == this.fundPlatfromAddress
    );

    return {
      address: tokenAddress,
      name: await token.symbol(),
      amount: parseFloat(ethers.utils.formatUnits(amount ? amount : await token.balanceOf(fundAddress), dec)),
      decimals: dec,
      logo: this.getLogoByAddress(tokenAddress),
    };
  }

  async getPlatformSettings() {
    const res = await this.platformContract.getPlatformData();
    console.log("platform settings: ", res);

    return {
      softCap: parseFloat(utils.formatEther(res._softCap)),
      hardCap: parseFloat(utils.formatEther(res._hardCap)),
      minimumTimeUntillFundStart: parseFloat(res._minimumTimeUntillFundStart),
      maximumTimeUntillFundStart: parseFloat(res._maximumTimeUntillFundStart),
      minimumProfitFee: parseFloat(res._minimumProfitFee),
      maximumProfitFee: parseFloat(res._maximumProfitFee),
      minimalManagerCollateral: parseFloat(utils.formatEther(res._minimalManagerCollateral)),
    };
  }

  async getPricesPath(routerAddress, amount: BigNumber, path: string[], overrides) {
    if (amount.isZero()) {
      return new Array(path.length).fill(BigNumber.from("0"));
    } else {
      const contract = await this.getSwapRouterContractInstance(routerAddress);
      const res = await contract.getAmountsOut(amount, path);
      return res;
    }
  }
  async signMessage(msg, desc) {
    return await this.getCurrentProvider()
      .getSigner()
      .signMessage(msg, desc);
  }
  async makeDeposit(fundAddress, amount: BigNumber) {
    const fundContract = this.getFundContractInstance(fundAddress);

    return await fundContract.makeDeposit({ value: amount });
  }

  async getCurrentSigner() {
    return await this.getCurrentProvider()
      // @ts-ignore: cannot assign vm to Event for some reasone
      .getSigner()
      // @ts-ignore: cannot assign vm to Event for some reasone
      .getAddress();
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

    const [
      fundInfo,
      isDepositsWithdrawed,
      allowedTokensAddresses,
      boughtTokensAddresses,
      swapHistory,
      fundCreatedAt,
      isFundProfitWitdrawed,
      lockedFundProfit,
      userDeposits,
    ] = await Promise.all([
      this.getFundDetails(address),
      fundContract.isDepositsWithdrawed(),
      fundContract.getAllowedTokensAddresses(),
      fundContract.getBoughtTokensAddresses(),
      fundContract.getAllSwaps(),
      fundContract.fundCreatedAt(),
      fundContract.fundProfitWitdrawed(),
      fundContract.lockedFundProfit(),
      fundContract.userDeposits(signerAddress),
    ]);

    return {
      ...fundInfo,
      fundCreatedAt: parseFloat(fundCreatedAt.toString()),
      isDepositsWithdrawed: isDepositsWithdrawed,
      isManager: fundInfo.managerAddress == signerAddress,
      allowedTokensAddresses: allowedTokensAddresses,
      boughtTokensAddresses: boughtTokensAddresses.filter(v => v != ZERO_ADDRESS),
      isFundProfitWitdrawed: Boolean(isFundProfitWitdrawed),
      lockedFundProfit: parseFloat(utils.formatEther(lockedFundProfit)),
      userHasDepositsInFund: parseFloat(userDeposits) != 0,
      swaps: swapHistory.map(v => {
        return {
          amountFrom: v.amountFrom,
          amountTo: v.amountTo,
          timeStamp: v.timeStamp,
          to: v.to,
          from: v.from,
        };
      }),
    };
  }

  async getAllManagerFunds(address) {
    const data = (await this.platformContract.getManagerFunds(address)).slice().map(v => {
      return {
        address: v,
      };
    });

    const res = [];

    for (const val of data) {
      res.push({
        ...val,
        ...(await getFundInfoByAddress(val.address, this.networkSettings.chainId)),
      });
    }
    return data;
  }

  async getAllManagerFundsWithDetails(address) {
    const data = await this.platformContract.getManagerFunds(address);

    return await Promise.all(
      data
        .slice()
        .reverse()
        .map(async addr => {
          return await this.getFundDetails(addr);
        })
    );
  }

  async getAllInvestorsFunds(address) {
    const data = await this.platformContract.getInvestorFunds(address);

    return data.slice().map(v => {
      return {
        address: v,
      };
    });
  }

  async getAllInvestorsFundsWithDetails(address) {
    const data = await this.platformContract.getInvestorFunds(address);

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
    const infoFromServer = await getFundInfoByAddress(fundAddress, this.networkSettings.chainId);
    const userInfoFromServer = await getUserByAddress(info._fundManager, this.networkSettings.chainId);

    const fundInfo = {
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
      balance:
        parseFloat(utils.formatEther(info._currentBalance)) - parseFloat(utils.formatEther(info._managerCollateral)),
      investorsAmount: info._deposits.length,
      deposits: info._deposits
        .filter(v => v.depositOwner != ZERO_ADDRESS && !v.depositAmount.isZero())
        .map(d => {
          return {
            amount: parseFloat(utils.formatEther(d.depositAmount)),
            owner: d.depositOwner,
            isWithdrawed: d.isWithdrawed,
          };
        }),
    };

    return {
      ...fundInfo,
      ...{
        baseBalance:
          fundInfo.status == "Opened" ? null : parseFloat(utils.formatEther(await fundContract.baseBalance())),
        endBalance:
          fundInfo.status == "Opened" || fundInfo.status == "Active"
            ? null
            : parseFloat(utils.formatEther(await fundContract.endBalance())),
        originalEndBalance:
          fundInfo.status == "Opened" || fundInfo.status == "Active"
            ? null
            : parseFloat(utils.formatEther(await fundContract.originalEndBalance())),
        description: infoFromServer?.description,
        title: infoFromServer?.name,
        author: userInfoFromServer?.username == null ? info._fundManager : userInfoFromServer?.username,
        imgUrl: infoFromServer?.imageUrl == null ? DEFAULT_IMG_URL : infoFromServer?.imageUrl,
        authorProfileImageUrl: userInfoFromServer?.imageUrl == null ? DEFAULT_IMG_URL : userInfoFromServer?.imageUrl,
      },
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
    const factory = this.getSwapFactoryContractInstance(factoryAddress);

    const path = [tokenFrom, tokenTo];

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
