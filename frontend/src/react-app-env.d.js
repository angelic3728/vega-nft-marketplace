interface Window {
    ethereum?: {
      isMetaMask?: true
      request?: (...args: any[]) => Promise<void>
      selectedAddress?: string,
    }
    BinanceChain?: {
      bnbSign?: (address: string, message: string) => Promise<{ publicKey: string; signature: string }>
    }
  }
  
type SerializedBigNumber = string
