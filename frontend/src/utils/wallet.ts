// Set of helper functions to facilitate wallet setup

/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async () => {
  const provider = window.ethereum;
  if (provider) {
    const chainId = 3;
    const chainType = "Testnet";
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x3" }],
      });
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: `0x${chainId.toString(16)}`,
            chainName: `Ropsten ${chainType}`,
            nativeCurrency: {
              name: "Ether",
              symbol: "ether",
              decimals: 18,
            },
            rpcUrls: [
              "https://ropsten.infura.io/v3/24bxzRYXiIpIcS1tnuqjlNRMqpv",
            ],
            blockExplorerUrls: [`https://ropsten.etherscan.io`],
          },
        ],
      });
      return true;
    } catch (error) {
      console.error("Failed to setup the network in Metamask:", error);
      return false;
    }
  } else {
    console.error(
      "Can't setup the Cronos network on metamask because window.ethereum is undefined"
    );
    return false;
  }
};

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
