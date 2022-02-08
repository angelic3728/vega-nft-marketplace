import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import {
  getNftTokenContract,
  getMarketplaceContract,
  getAuctionContract,
} from "../utils/contractHelpers";

export const useNftTokenContract = (address: string) => {
  const { library } = useActiveWeb3React();
  return useMemo(() => getNftTokenContract(library.getSigner()), [library]);
};

export const useMarketplaceContract = (address: string) => {
    const { library } = useActiveWeb3React();
    return useMemo(() => getMarketplaceContract(library.getSigner()), [library]);
  };

  export const useAuctionContract = (address: string) => {
    const { library } = useActiveWeb3React();
    return useMemo(() => getAuctionContract(library.getSigner()), [library]);
  };
  