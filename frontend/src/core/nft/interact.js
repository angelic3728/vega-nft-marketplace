import { pinJSONToIPFS, pinFileToIPFS } from "./pinata.js";
import dotenv from "dotenv";

dotenv.config();

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
    const tokenId = Number(upload_time.getTime().toString().substr(-6));
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
  }
};
