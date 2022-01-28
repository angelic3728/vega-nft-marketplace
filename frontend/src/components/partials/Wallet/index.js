import React from "react";

const Wallet = function () {
    const [walletAddress, setWalletAddress] = React.useState("");

  const connectMetamask = async () => {
    // Check if MetaMask is installed on user's browser
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      const chainId = await window.ethereum.request({ method: "eth_chainId" });
      debugger;
      // Check if user is connected to Mainnet
      if (chainId != "0x19") {
        alert("Please connect to Ropsten");
      } else {
        let wallet = accounts[0];
        setWalletAddress(wallet);
      }
    } else {
      alert("Please install Mask");
    }
  };

  return (
    <div className="row">
      <div className="col-lg-3 mb30" onClick={connectMetamask}>
        <span className="box-url">
          <span className="box-url-label">Most Popular</span>
          <img src="./img/wallet/1.png" alt="" className="mb20" />
          <h4>Metamask</h4>
          <p>
            Start exploring blockchain applications in seconds. Trusted by over
            1 million users worldwide.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/3.png" alt="" className="mb20" />
          <h4>Fortmatic</h4>
          <p>
            Let users access your Ethereum app from anywhere. No more browser
            extensions.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/4.png" alt="" className="mb20" />
          <h4>WalletConnect</h4>
          <p>
            Open source protocol for connecting decentralised applications to
            mobile wallets.
          </p>
        </span>
      </div>

      <div className="col-lg-3 mb30">
        <span className="box-url">
          <img src="./img/wallet/5.png" alt="" className="mb20" />
          <h4>Coinbase Wallet</h4>
          <p>
            The easiest and most secure crypto wallet. ... No Coinbase account
            required.
          </p>
        </span>
      </div>
    </div>
  );
};
export default Wallet;
