import { pinJSONToIPFS, pinFileToIPFS } from "./pinata.js";
require("dotenv").config();
const infuraRPCUrl = process.env.REACT_APP_INFURA_KEY;
const contractABI = require("./contract-abi.json");
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(infuraRPCUrl);

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const obj = {
        status: "Metamask successfuly connected.",
        address: addressArray[0],
      };
      return obj;
    } catch (err) {
      return {
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  } else {
    // toast({
    //   title: "Please install MetaMask first.",
    //   status: "info",
    //   position: "top-right",
    //   isClosable: true,
    // });
    return;
  }
};

export const getCurrentWalletConnected = async () => {
  if (window.ethereum) {
    try {
      const addressArray = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (addressArray.length > 0) {
        return {
          address: addressArray[0],
          status: "Fill in the text-field above.",
        };
      } else {
        return {
          address: "",
          status: "🦊 Connect to Metamask using the top right button.",
        };
      }
    } catch (err) {
      return {
        address: "",
        status: "Something went wrong: " + err.message,
      };
    }
  } else {
    return {
      address: "",
      status: (
        <span>
          <p>
            {" "}
            🦊{" "}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://metamask.io/download.html`}
            >
              You must install Metamask, a virtual Ethereum wallet, in your
              browser.
            </a>
          </p>
        </span>
      ),
    };
  }
};

export const mintNFT = async (name, description, file, onClose, successToast) => {
  if (name.trim() === "" || description.trim() === "") {
    return {
      success: false,
      status: "Please make sure all fields are completed before minting.",
    };
  }

  const fileUpload = await pinFileToIPFS(file);
  if (fileUpload.success) {
    const pinataFileUrl = fileUpload.pinataFileUrl;
    const timestamp = fileUpload.timestamp;
    var upload_time = new Date(timestamp);
    const tokenId = upload_time.getTime();
    //make metadata
    const metadata = {};
    metadata.name = name;
    metadata.url = pinataFileUrl;
    metadata.description = description;

    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
      return {
        success: false,
        status: "Something went wrong while uploading your tokenURI.",
      };
    }
    const tokenURI = pinataResponse.pinataUrl;

    window.contract = await new web3.eth.Contract(
      contractABI,
      process.env.REACT_APP_NFT_TOKEN_ADDRESS
    );

    const transactionParameters = {
      to: process.env.REACT_APP_NFT_TOKEN_ADDRESS, // Required except during contract publications.
      from: window.ethereum.selectedAddress, // must match user's active address.
      data: window.contract.methods
        .mintWithTokenURI(window.ethereum.selectedAddress, tokenId, tokenURI)
        .encodeABI(),
    };

    try {
      const txHash = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      onClose();
      successToast();
      return {
        success: true,
        status:
          "Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
          txHash,
      };
    } catch (error) {
      onClose();
      return {
        success: false,
        status: "Something went wrong: " + error.message,
      };
    }
  }
};
