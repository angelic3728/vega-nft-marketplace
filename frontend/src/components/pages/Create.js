import React, { useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { useSelector, useDispatch } from "react-redux";
import DatePicker from "react-datepicker";
import { useModal } from "@pancakeswap-libs/uikit";
import Clock from "../partials/Common/Clock";
import Footer from "../partials/Footer";
import * as selectors from "../../store/selectors";
import { setCreationStatus } from "../../store/actions";
import { useNftTokenContract } from "../../hooks/useContracts";
import { useMarketplaceContract } from "../../hooks/useContracts";
import { useAuctionContract } from "../../hooks/useContracts";
import { getNFTTokenAddress } from "../../utils/addressHelpers";
import { toWeiBalance } from "../../utils/getBalance";
import getBlockNumber from "../../utils/getBlockNumber";
import useToast from "../../hooks/useToast";
import { uploadNFT } from "../../core/nft/interact";
import NumericalInput from "../../items/Inputs/NumericalInput";
import NormalInput from "../../items/Inputs/NormalInput";
import MintFlowModal from "../partials/Create/MintFlowModal";
import "react-datepicker/dist/react-datepicker.css";

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from "../Styles";
//SWITCH VARIABLE FOR PAGE STYLE
const theme = "GREYLOGIN"; //LIGHT, GREY, RETRO

const Create = () => {
  const dispatch = useDispatch();
  const [publicAddress, setPublicAddress] = useState("");
  const [createMethod, setCreateMethod] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [price, setPrice] = useState(0);
  const [royaltie, setRoyaltie] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [mintFile, setMintFile] = useState(null);
  const [endDate, setEndDate] = useState(new Date());
  const [unlockContent, setUnlockContent] = useState("");
  const nftTokenContract = useNftTokenContract();
  const marketplaceContract = useMarketplaceContract();
  const auctionContract = useAuctionContract();
  const nftTokenAddress = getNFTTokenAddress();
  const { toastSuccess, toastWarning, toastError } = useToast();

  const cookies = new Cookies();

  const erc20TokenAddress = process.env.REACT_APP_ERC20_TOKEN_ADDRESS;

  const [onPresentMintFlowModal, onDismiss] = useModal(
    <MintFlowModal createMethod={createMethod} />,
    false
  );
  const myBalanceState = useSelector(selectors.myBalanceState);
  const myBalance = myBalanceState ? myBalanceState : 0;

  const createNFT = async () => {
    if (myBalance < 0.0005) {
      toastError(
        "Insufficient Balance",
        "You can't mint the asset because of insufficient balance in your wallet."
      );
    } else {
      const currentTime = new Date();
      if (title.trim().length === 0) {
        toastWarning("Warning", "Please fill in the Title field.");
      } else if (description.length === 0) {
        toastWarning("Warning", "Please fill in the Description field.");
      } else if (!mintFile) {
        toastWarning("Warning", "Please select the asset file.");
      } else if ((createMethod === 1 || createMethod === 3) && Number(price) === 0) {
        toastWarning("Warning", "Please fill in the Price field.");
      } else if (royaltie === "") {
        toastWarning("Warning", "Please fill in the Royaltie field.");
      } else if ((createMethod === 2 || createMethod === 3) && ((endDate.getTime() - currentTime.getTime()) < 0)) {
        toastWarning("Warning", "Please fill the end Date from tomorrow.");
      } else {
        onPresentMintFlowModal();
        const uploadRes = await uploadNFT(title, description, mintFile);
        if (uploadRes && uploadRes.success) {
          dispatch(setCreationStatus(1));
          performMint(uploadRes.metadata[0], uploadRes.metadata[1]);
        } else {
          onDismiss();
          toastError("Error", uploadRes.status);
        }
      }
    }
  };

  const performMint = async (id, uri) => {
    try {
      await nftTokenContract.mintWithTokenURI(
        publicAddress,
        id,
        uri
      );
      // const receipt = await tx.wait();
      if (createMethod === 1 || createMethod === 3) {
        dispatch(setCreationStatus(2));
        listingMarketplace(id);
      } else {
        dispatch(setCreationStatus(3));
        createAuction(id);
      }
    } catch (err) {
      onDismiss();
      dispatch(setCreationStatus(0));
      toastError("Error", err.message);
    }
  };

  const listingMarketplace = async (tokenId) => {
    try {
      await marketplaceContract.createListing(
        tokenId.toString(),
        true,
        nftTokenAddress,
        tokenId,
        toWeiBalance(price),
        publicAddress,
        1,
        erc20TokenAddress
      );
      // const receipt = await tx.wait();
      dispatch(setCreationStatus(3));
      if (createMethod === 3) {
        createAuction(tokenId);
      } else {
        onDismiss();
        dispatch(setCreationStatus(0));
        toastSuccess("Contratlations", "Successfully listed!");
        resetAssets();
      }
    } catch (err) {
      onDismiss();
      dispatch(setCreationStatus(0));
      toastError("Error", err.message);
      resetAssets();
    }
  };

  const createAuction = async (tokenId) => {
    try {
      const endBlockNumber = await getBlockNumber(endDate);
      await auctionContract.createAuction(
        tokenId.toString(),
        true,
        nftTokenAddress,
        tokenId,
        publicAddress,
        1,
        endBlockNumber,
        erc20TokenAddress
      );
      // const receipt = await tx.wait();
      dispatch(setCreationStatus(4));
      onDismiss();
      dispatch(setCreationStatus(0));
      toastSuccess("Contratlations", "Successfully opened!");
      resetAssets();
    } catch (err) {
      onDismiss();
      dispatch(setCreationStatus(0));
      toastError("Error", err.message);
      resetAssets();
    }
  };

  const resetAssets = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setCreateMethod(1);
    setIsActive(false);
    setUnlockContent("");
    setRoyaltie("");
  };

  useEffect(() => {
    const publicAddress = cookies.get(
      process.env.REACT_APP_ADDRESS_COOKIE_NAME
    );

    setPublicAddress(publicAddress);
  }, []);

  return (
    <div className="greyscheme">
      <StyledHeader theme={theme} />
      <section className="jumbotron breadcumb no-bg">
        <div className="mainbreadcumb">
          <div className="container">
            <div className="row m-10-hor">
              <div className="col-12">
                <h1 className="text-center">Create</h1>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="row">
          <div className="col-lg-7 offset-lg-1 mb-5">
            <div className="field-set">
              <h5>Upload file</h5>
              <div className="d-create-file" style={{ textAlign: "center" }}>
                {fileUrl !== "" && (
                  <img
                    width="250px"
                    src={fileUrl}
                    style={{ margin: "0 auto", borderRadius: 10 }}
                    alt="NFT Asset"
                  />
                )}
                {fileUrl === "" && (
                  <p id="file_name" style={{ color: "white" }}>
                    Please choose one asset.
                  </p>
                )}
                <div className="browse" style={{ marginTop: 10 }}>
                  <input
                    type="button"
                    id="get_file"
                    className="btn-main"
                    value="Browse"
                  />
                  <input
                    id="upload_file"
                    type="file"
                    multiple
                    onChange={(e) => {
                      var file = e.target.files[0];
                      setMintFile(file);
                      var reader = new FileReader();
                      reader.readAsDataURL(file);
                      reader.onloadend = function () {
                        setFileUrl(reader.result);
                      }.bind(this);
                    }}
                  />
                </div>
              </div>

              <div className="spacer-single"></div>
              <h5>Select method</h5>
              <div className="de_tab tab_methods">
                <ul className="de_nav">
                  <li
                    id="btn1"
                    className={createMethod === 1 ? "active" : ""}
                    onClick={() => setCreateMethod(1)}
                  >
                    <span>
                      <i className="fa fa-tag"></i>Fixed price
                    </span>
                  </li>
                  <li
                    id="btn2"
                    className={createMethod === 2 ? "active" : ""}
                    onClick={() => setCreateMethod(2)}
                  >
                    <span>
                      <i className="fa fa-hourglass-1"></i>Timed auction
                    </span>
                  </li>
                  <li
                    id="btn3"
                    className={createMethod === 3 ? "active" : ""}
                    onClick={() => setCreateMethod(3)}
                  >
                    <span>
                      <i className="fa fa-users"></i>Open for bids
                    </span>
                  </li>
                </ul>

                <div className="de_tab_content pt-3">
                  <div
                    id="tab_opt_1"
                    className={
                      createMethod === 1 || createMethod === 3 ? "show" : "hide"
                    }
                  >
                    <h5>Price</h5>
                    <NumericalInput
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="enter price for one item (ETH)"
                    />
                  </div>

                  <div
                    id="tab_opt_2"
                    className={createMethod === 1 ? "hide" : "show"}
                  >
                    <div className="spacer-20"></div>
                    <div className="row">
                      <div className="col-md-6">
                        <h5>Auction End Date</h5>
                        <DatePicker
                          selected={endDate}
                          minDate={new Date()}
                          onChange={(date) => setEndDate(date)}
                          disabledKeyboardNavigation
                        />
                      </div>
                    </div>
                  </div>

                  <div id="tab_opt_3"></div>
                </div>
              </div>

              <div className="spacer-20"></div>

              <div className="switch-with-title">
                <h5>
                  <i className="fa fa- fa-unlock-alt id-color-2 mr10"></i>
                  Unlock once purchased
                </h5>
                <div className="de-switch">
                  <input
                    type="checkbox"
                    id="switch-unlock"
                    className="checkbox"
                  />
                  {isActive ? (
                    <label
                      htmlFor="switch-unlock"
                      onClick={() => {
                        setIsActive(false);
                      }}
                    ></label>
                  ) : (
                    <label
                      htmlFor="switch-unlock"
                      onClick={() => {
                        setIsActive(true);
                      }}
                    ></label>
                  )}
                </div>
                <div className="clearfix"></div>
                <p className="p-info pb-3" style={{ color: "gray" }}>
                  Unlock content after successful transaction.
                </p>

                {isActive ? (
                  <div id="unlockCtn" className="hide-content">
                    <NormalInput
                      placeholder="Access key, code to redeem or link to a file..."
                      value={unlockContent}
                      onChange={(e) => setUnlockContent(e.target.value)}
                    />
                    <div className="spacer-20"></div>
                  </div>
                ) : null}
              </div>

              <h5>Title</h5>
              <NormalInput
                placeholder="e.g. 'Crypto Funk"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="spacer-20"></div>

              <h5>Description</h5>
              <textarea
                data-autoresize
                name="item_desc"
                id="item_desc"
                value={description}
                className="form-control"
                placeholder="e.g. 'This is very limited item'"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="spacer-20"></div>

              <h5>Royalties</h5>
              <NumericalInput
                placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%"
                value={royaltie}
                onChange={(e) => setRoyaltie(e.target.value)}
              />

              <div className="spacer-20"></div>

              <input
                type="button"
                onClick={createNFT}
                className="btn-main"
                value="Create Item"
              />
            </div>
          </div>

          <div className="col-lg-3 col-sm-6 col-xs-12">
            <h5>Preview item</h5>
            <div className="nft__item m-0">
              {(createMethod === 2 || createMethod === 3) && (
                <div className="de_countdown">
                  <Clock deadline="December, 30, 2022" />
                </div>
              )}
              <div className="author_list_pp">
                <span>
                  <img
                    className="lazy"
                    src="./img/author/author-1.jpg"
                    alt=""
                  />
                  <i className="fa fa-check"></i>
                </span>
              </div>
              <div className="nft__item_wrap">
                <span>
                  <img
                    src={fileUrl}
                    id="get_file_2"
                    className="lazy nft__item_preview"
                    alt=""
                  />
                </span>
              </div>
              <div className="nft__item_info">
                <span>
                  <h4>{title}</h4>
                </span>
                {(createMethod === 1 || createMethod === 3) && (
                  <div className="nft__item_price">{price} ETH</div>
                )}
                {(createMethod === 2 || createMethod === 3) && (
                  <div className="nft__item_action">
                    <span>Place a bid</span>
                  </div>
                )}
                <div className="nft__item_like">
                  <i className="fa fa-heart"></i>
                  <span>50</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Create;
