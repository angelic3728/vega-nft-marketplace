import { pinJSONToIPFS, pinFileToIPFS } from "./pinata.js";
require("dotenv").config();

export const uploadNFT = async (name, description, file) => {
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

    // window.contract = await new web3.eth.Contract(
    //   contractABI,
    //   process.env.REACT_APP_NFT_TOKEN_ADDRESS
    // );

    return {
      success: true,
      metadata:[tokenId, tokenURI]
    };

    // const transactionParameters = {
    //   to: process.env.REACT_APP_NFT_TOKEN_ADDRESS, // Required except during contract publications.
    //   from: window.ethereum.selectedAddress, // must match user's active address.
    //   data: window.contract.methods
    //     .mintWithTokenURI(window.ethereum.selectedAddress, tokenId, tokenURI)
    //     .encodeABI(),
    // };

    // try {
    //   const txHash = await window.ethereum.request({
    //     method: "eth_sendTransaction",
    //     params: [transactionParameters],
    //   });
    //   onClose();
    //   successToast();
    //   return {
    //     success: true,
    //     status:
    //       "Check out your transaction on Etherscan: https://ropsten.etherscan.io/tx/" +
    //       txHash,
    //   };
    // } catch (error) {
    //   onClose();
    //   return {
    //     success: false,
    //     status: "Something went wrong: " + error.message,
    //   };
    // }
  }
};
