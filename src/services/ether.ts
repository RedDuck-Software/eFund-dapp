import { ethers, providers, Contract } from "ethers";

import EFundPlatform from "../artifacts/contracts/EFundPlatform.sol/EFundPlatform.json";
import { vm } from "../main";

declare global {
  interface Window {
    ethereum: any;
  }
}

const ethereum: providers.ExternalProvider = window.ethereum;
export const currentProvider = new providers.Web3Provider(ethereum);

export const BNB_ADDRESS = "0xae13d989dac2f0debff460ac112a837c89baa7cd";
export const ABI = JSON.stringify(EFundPlatform.abi);
export const CONTRACT_ADDRESS = "0x82Dea86f24dddEd0E0FA42e28c2Acc6429DD1Df8";

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

export const startApp = async (): Promise<string[] | void> => {
  if (!isMetaMaskInstalled()) {
    alert("Please install MetaMask!");
    return;
  }
};

window.ethereum.on("accountsChanged", ([newAddress]) => {
  vm.$store.commit("updateSignerAddress", newAddress ? newAddress : "");
});

window.ethereum.on("chainIdChanged", async ([networkId]) => {
  const { address } = await getSigner();
  vm.$store.commit("updateSignerAddress", address ? address : "");
});
