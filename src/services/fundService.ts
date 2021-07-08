import { ethers } from "ethers";
import { currentProvider, getSigner } from "./ether";
import {FUND_ABI, FUND_PLATFORM_ABI, ERC20_ABI} from "../constants";

export class FundService {
  fundPlatfromAddress;

  currentProvider;
  
  constructor(fundPlatfromAddress : string, provider) { 
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
    return new ethers.Contract(address, FUND_ABI , this.currentProvider.getSigner());
  }

  getERC20ContractInstance(address) { 
    return new ethers.Contract(address, ERC20_ABI , this.currentProvider.getSigner());
  }
}