import { ethers, utils } from "ethers";
import { currentProvider, getSigner } from "./ether";
import { FUND_ABI, FUND_PLATFORM_ABI, ERC20_ABI, SWAP_ROUTER_ABI } from "../constants";

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

  // erc20 balance of
  async balanceOfFormatted(tokenAddress, of) {
    const contract = this.getERC20ContractInstance(tokenAddress);
    return utils.formatUnits(await contract.balanceOf(of), await contract.decimals());
  }

  // balance in ETH|BNB
  async getBalanceFormatted(of) {
    return utils.formatEther(await this.currentProvider.getBalance(of));
  }

  async findOptimalPathForSwap(tokenFrom, tokenTo, availableTokens) {
    return [tokenFrom, tokenTo];
  }
}
