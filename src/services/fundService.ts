import { ethers, utils } from "ethers";
import { currentProvider } from "./ether";
import { FUND_ABI, FUND_PLATFORM_ABI, ERC20_ABI, SWAP_ROUTER_ABI, SWAP_FACTORY_ABI, ZERO_ADDRESS, SWAP_PAIR_ABI } from "../constants";

function arrayInsertBefore(arr, index, value) {
  return arr.splice(index, 0, value);
}

function arrayRemoveAt(arr, indexFrom, indexTo) {
  return arr.splice(indexFrom, indexTo);
}

export class FundService {
  fundPlatfromAddress;

  currentProvider;

  constructor(fundPlatfromAddress: string, provider) {
    this.fundPlatfromAddress = fundPlatfromAddress;
    this.currentProvider = provider;
  }

  getCurrentProvider() {
    return currentProvider;
  }

  getFundPlatformContractInstance() {
    return new ethers.Contract(this.fundPlatfromAddress, FUND_PLATFORM_ABI, this.currentProvider.getSigner());
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

  getSwapPairContractInstance(address) {
    return new ethers.Contract(address, SWAP_PAIR_ABI, this.currentProvider.getSigner());
  }

  async getSwapFactoryAddress(swapRouterAddress) {
    const router = this.getSwapRouterContractInstance(swapRouterAddress);

    return await router.factory();
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

      if (await this.isPathExists(curPath, factory))
        return curPath;
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