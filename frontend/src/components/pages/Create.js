import React, { useEffect, useState } from "react";
import Clock from "../partials/Common/Clock";
import Footer from "../partials/Footer";
import { useCallWithGasPrice } from '../../hooks/useCallWithGasPrice';
import { useNftTokenContract } from '../../hooks/useContracts'
import useApproveConfirmTransaction from '../../hooks/useApproveConfirmTransaction'
import useToast from '../../hooks/useToast'
import { useWeb3React } from "@web3-react/core";
import { uploadNFT } from "../../core/nft/interact";

// import { createGlobalStyle } from 'styled-components';

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from "../Styles";
//SWITCH VARIABLE FOR PAGE STYLE
const theme = "GREYLOGIN"; //LIGHT, GREY, RETRO

const Create = () => {
  const [createMethod, setCreateMethod] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [price, setPrice] = useState(0);
  const [royaltie, setRoyaltie] = useState(0);
  const [fileUrl, setFileUrl] = useState("");
  const [mintFile, setMintFile] = useState(null);
  const [minBids, setMinBids] = useState("");
  const [startDate, setStartDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [unlockContent, setUnlockContent] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const nftTokenContract = useNftTokenContract();
  const { account } = useWeb3React();
  const { toastSuccess } = useToast()

  const handleShow = () => {
    setCreateMethod(1);
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("tab_opt_1").classList.remove("hide");
    document.getElementById("tab_opt_2").classList.remove("show");
    document.getElementById("btn1").classList.add("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.remove("active");
  };
  const handleShow1 = () => {
    setCreateMethod(2);
    document.getElementById("tab_opt_1").classList.add("hide");
    document.getElementById("tab_opt_1").classList.remove("show");
    document.getElementById("tab_opt_2").classList.add("show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.add("active");
    document.getElementById("btn3").classList.remove("active");
  };
  const handleShow2 = () => {
    setCreateMethod(3);
    document.getElementById("tab_opt_1").classList.add("show");
    document.getElementById("btn1").classList.remove("active");
    document.getElementById("btn2").classList.remove("active");
    document.getElementById("btn3").classList.add("active");
  };

  const createNFT = async () => {
    const uploadRes =  await uploadNFT(title, description, mintFile);
    if(uploadRes && uploadRes.success) {
      setTokenId(uploadRes.metadata[0]);
      setTokenURI(uploadRes.metadata[1]);
    }
  };

  const performMint = async () => {

    const tx = await nftTokenContract.mintWithTokenURI(account, tokenId, tokenURI);
    const receipt = await tx.wait();
    console.log(receipt);
    toastSuccess("Successfully performed!", receipt.blockHash);
  }

  useEffect(() => {
    if(account && tokenId !== "" && tokenURI !== "") {
      performMint()
    }
  }, [tokenId, tokenURI]);

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
                    style={{ margin: "0 auto", borderRadius:10 }}
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
                      reader.onloadend = function (e) {
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
                  <li id="btn1" className="active" onClick={handleShow}>
                    <span>
                      <i className="fa fa-tag"></i>Fixed price
                    </span>
                  </li>
                  <li id="btn2" onClick={handleShow1}>
                    <span>
                      <i className="fa fa-hourglass-1"></i>Timed auction
                    </span>
                  </li>
                  <li id="btn3" onClick={handleShow2}>
                    <span>
                      <i className="fa fa-users"></i>Open for bids
                    </span>
                  </li>
                </ul>

                <div className="de_tab_content pt-3">
                  <div id="tab_opt_1">
                    <h5>Price</h5>
                    <input
                      type="text"
                      name="item_price"
                      id="item_price"
                      className="form-control"
                      placeholder="enter price for one item (ETH)"
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div id="tab_opt_2" className="hide">
                    <h5>Minimum bid</h5>
                    <input
                      type="text"
                      name="item_price_bid"
                      id="item_price_bid"
                      className="form-control"
                      placeholder="enter minimum bid"
                      onChange={(e) => setMinBids(e.target.value)}
                    />

                    <div className="spacer-20"></div>

                    <div className="row">
                      <div className="col-md-6">
                        <h5>Starting date</h5>
                        <input
                          type="date"
                          name="bid_starting_date"
                          id="bid_starting_date"
                          className="form-control"
                          min="1997-01-01"
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </div>
                      <div className="col-md-6">
                        <h5>Expiration date</h5>
                        <input
                          type="date"
                          name="bid_expiration_date"
                          id="bid_expiration_date"
                          className="form-control"
                          onChange={(e) => setExpireDate(e.target.value)}
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
                        debugger;
                        setIsActive(false);
                      }}
                    ></label>
                  ) : (
                    <label
                      htmlFor="switch-unlock"
                      onClick={() => {
                        debugger;
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
                    <input
                      type="text"
                      name="item_unlock"
                      id="item_unlock"
                      className="form-control"
                      placeholder="Access key, code to redeem or link to a file..."
                      onChange={(e) => setUnlockContent(e.target.value)}
                    />
                  </div>
                ) : null}
              </div>

              <h5>Title</h5>
              <input
                type="text"
                name="item_title"
                id="item_title"
                className="form-control"
                placeholder="e.g. 'Crypto Funk"
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="spacer-10"></div>

              <h5>Description</h5>
              <textarea
                data-autoresize
                name="item_desc"
                id="item_desc"
                className="form-control"
                placeholder="e.g. 'This is very limited item'"
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>

              <div className="spacer-10"></div>

              <h5>Royalties</h5>
              <input
                type="text"
                name="item_royalties"
                id="item_royalties"
                className="form-control"
                placeholder="suggested: 0, 10%, 20%, 30%. Maximum is 70%"
                onChange={(e) => setRoyaltie(e.target.value)}
              />

              <div className="spacer-10"></div>

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
                  <h4>NFT Title</h4>
                </span>
                {(createMethod === 2 || createMethod === 3) && (
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
