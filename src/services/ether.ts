import { providers } from "ethers";
declare global {
  interface Window {
    ethereum: any;
  }
}

const ethereum: providers.ExternalProvider = window.ethereum;
export const cProvider = ethereum ? new providers.Web3Provider(ethereum) : undefined;

export const walletProvider = {
  currentProvider: (window.ethereum ? new providers.Web3Provider(ethereum) : undefined),
};

export const currentProvider =  () => walletProvider.currentProvider;

export const createWeb3Provider = (wallet) => new providers.Web3Provider(wallet);

export const getSigner = async (): Promise<{
  jsonSigner: any;
  address: string;
}> => {
  const jsonSigner = await currentProvider().getSigner();
  const address = await jsonSigner.getAddress();

  return { jsonSigner, address };
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