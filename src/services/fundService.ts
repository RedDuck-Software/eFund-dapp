import { Contract, ethers } from "ethers";
import { currentProvider, getSigner } from "./ether";
import FundAbi from "../artifacts/contracts/HedgeFund.sol/HedgeFund.json";

export const ABI = JSON.stringify(FundAbi.abi);

export let fundSignedContract;

export const getSignedFundContract = async (address: string): Promise<Contract> => {
  const { jsonSigner } = await getSigner();
  fundSignedContract = new ethers.Contract(address, ABI, jsonSigner);
  return fundSignedContract;
};

export const getReadOnlyFundContract = async (address: string): Promise<Contract> => {
  return new ethers.Contract(address, ABI, currentProvider);
};
