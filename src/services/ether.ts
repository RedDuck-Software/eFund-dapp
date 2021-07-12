import { ethers, providers, Contract } from "ethers";

import EFundPlatform from "../artifacts/contracts/EFundPlatform.sol/EFundPlatform.json";
import { vm } from "../main";

declare global {
  interface Window {
    ethereum: any;
  }
}

const metamaskProvider: providers.ExternalProvider = window.ethereum;

export const currentProvider = new providers.Web3Provider(metamaskProvider);

export const BNB_ADDRESS = "0xae13d989dac2f0debff460ac112a837c89baa7cd";


export const getSigner = async (): Promise<{
  jsonSigner: any;
  address: string;
}> => {
  const jsonSigner = await currentProvider.getSigner();
  const address = await jsonSigner.getAddress();

  return { jsonSigner, address };
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

window.ethereum.on("accountsChanged", ([newAddress]) => {
  vm.$store.commit("updateSignerAddress", newAddress ? newAddress : "");
});

window.ethereum.on("chainIdChanged", async ([networkId]) => {
  const { address } = await getSigner();
  vm.$store.commit("updateSignerAddress", address ? address : "");
});
