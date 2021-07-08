import { Contract, ethers } from "ethers";
import { currentProvider, getSigner } from "./ether";
import FundAbi from "../artifacts/contracts/HedgeFund.sol/HedgeFund.json";
import FundPlatformAbi from "../artifacts/contracts/EFundPlatform.sol/EFundPlatform.json";
import ERC20 from "../artifacts/contracts/Tokens/ERC20/eFund.sol/eFundERC20.json";

export const ABI = JSON.stringify(FundAbi.abi);

export const FUND_PLATFORM_ABI = JSON.stringify(FundPlatformAbi.abi);

export const FUND_ABI = JSON.stringify(FundAbi.abi);

export const ERC20_ABI = JSON.stringify(ERC20.abi);


export let fundSignedContract;

export const getSignedFundContract = async (address: string): Promise<Contract> => {
  const { jsonSigner } = await getSigner();
  fundSignedContract = new ethers.Contract(address, ABI, jsonSigner);
  return fundSignedContract;
};

export const getReadOnlyFundContract = async (address: string): Promise<Contract> => {
  return new ethers.Contract(address, ABI, currentProvider);
};


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