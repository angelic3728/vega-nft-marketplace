import addresses from "../core/constants/contracts";
import { Address } from "../core/constants/types";

export const getAddress = (address: Address): string => {
  const chainId = process.env.REACT_APP_CHAIN_ID;
  return address[chainId] ? address[chainId] : address["3"];
};

export const getNFTTokenAddress = () => {
  return getAddress(addresses.nftToken);
};
export const getNFTMarketPlace = () => {
  return getAddress(addresses.nftMarketplace);
};
export const getNFTAuction = () => {
  return getAddress(addresses.nftAuction);
};
