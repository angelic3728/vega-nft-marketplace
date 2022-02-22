import { useMemo } from "react";
import useActiveWeb3React from "./useActiveWeb3React";
import {
  getNftTokenContract,
  getMarketplaceContract,
  getAuctionContract,
} from "../utils/contractHelpers";

export const useNftTokenContract = () => {
  const { library } = useActiveWeb3React();
  if(library)
    return useMemo(() => getNftTokenContract(library.getSigner()), [library]);
  else
  return {};
};

export const useMarketplaceContract = () => {
    const { library } = useActiveWeb3React();
    if(library)
    return useMemo(() => getMarketplaceContract(library.getSigner()), [library]);
    else
    return {};
  };

  export const useAuctionContract = () => {
    const { library } = useActiveWeb3React();
    if(library)
    return useMemo(() => getAuctionContract(library.getSigner()), [library]);
    else
    return {};
  };
  