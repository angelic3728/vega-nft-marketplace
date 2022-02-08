import type { Signer } from "@ethersproject/abstract-signer";
import type { Provider } from "@ethersproject/providers";
import { Contract } from "@ethersproject/contracts";
import { simpleRpcProvider } from "./providers";

// Addresses
import {
  getAddress,
  getNFTTokenAddress,
  getNFTMarketPlace,
  getNFTAuction,
} from "./addressHelpers";

// ABI
import nftTokenAbi from "../core/abi/nftTokenAbi.json";
import marketplaceAbi from "../core/abi/nftMarketplaceAbi.json";
import auctionAbi from "../core/abi/nftAuctionAbi.json";

const getContract = (abi: any, address: string, signer?: Signer | Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider;
  return new Contract(address, abi, signerOrProvider);
};

export const getNftTokenContract = (
  signer?: Signer | Provider
) => {
  return getContract(nftTokenAbi, getNFTTokenAddress(), signer);
};

export const getMarketplaceContract = (
  signer?: Signer | Provider
) => {
  return getContract(marketplaceAbi, getNFTMarketPlace(), signer);
};

export const getAuctionContract = (
  signer?: Signer | Provider
) => {
  return getContract(auctionAbi, getNFTAuction(), signer);
};
