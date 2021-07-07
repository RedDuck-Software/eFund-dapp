import { ethers, providers, Contract } from "ethers";

import EFundPlatform from "../artifacts/contracts/EFundPlatform.sol/EFundPlatform.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ethereum: providers.ExternalProvider = window.ethereum;
export const currentProvider = new providers.Web3Provider(ethereum);

export const BNB_ADDRESS = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
export const ABI = JSON.stringify(EFundPlatform.abi);
export const CONTRACT_ADDRESS = "0xf59f9889CA8F34A1B75Cc75bc3C5C6CDEB388912";

export const readOnlyContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, currentProvider);

export const getSigner = async (): Promise<{
  jsonSigner: any;
  address: string;
}> => {
  const jsonSigner = await currentProvider.getSigner();
  const address = await jsonSigner.getAddress();

  return { jsonSigner, address };
};

export const getSignedFactoryContract = async (): Promise<Contract> => {
  const { jsonSigner } = await getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, jsonSigner);
};

export const getReadOnlyFactoryContract = async (): Promise<Contract> => {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, currentProvider);
};

export const isMetaMaskInstalled = () => {
  return Boolean(window.ethereum && window.ethereum.isMetaMask);
};

export const startApp = (): string[] | void => {
  if (!isMetaMaskInstalled()) {
    alert("Please install MetaMask!");
    return;
  }
};
