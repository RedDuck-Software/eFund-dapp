import { ethers } from "ethers";

export function getAfterCommaSigns(x: string) {
  if (x !== undefined) {
    // @ts-ignore
    return x.includes(".") ? x.split(".").pop().length : 0;
  }
  return 0;
}

export function toMaxPrecisions(x: string, max: number) {
  return parseFloat(x).toFixed(max);
}

export function rounded(num: number) {
  return Math.round(num * 100) / 100;
}

export async function calculateTransferValue(contractInstance: ethers.Contract, amountToSend: string) {
  const decimals = await contractInstance.decimals();
  const tokenDecimals = ethers.BigNumber.from(decimals);

  const countAfterComma = getAfterCommaSigns(amountToSend);
  const integerTransferAmount = "" + Math.floor(+amountToSend * 10 ** countAfterComma);

  // WARNING here - the order of mul and div is IMPORTANT
  // WARNING here - it's important for it to be 10 ** countAfterComma since countAfterComma here is a number not a BN.
  // warning please be thriple careful before messing up with this code.
  const calculatedTransferValue = ethers.BigNumber.from(integerTransferAmount)
    .mul(ethers.BigNumber.from(10).pow(tokenDecimals)) // multiply by ERC20 token decimals
    .div(ethers.BigNumber.from(10 ** countAfterComma)); // return the actual amount (we multiplied it earlier to get rid of decimal)

  return calculatedTransferValue;
}

export function formatNumberWithSpace(number) {
  return number.toString().replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
}
