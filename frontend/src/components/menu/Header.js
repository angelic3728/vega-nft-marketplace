import React, { useEffect, useState } from "react";
import Breakpoint, {
  BreakpointProvider,
  setDefaultBreakpoints,
} from "react-socks";
//import { header } from 'react-bootstrap';
import { Link } from "@reach/router";
import useOnclickOutside from "react-cool-onclickoutside";
import {
  Button,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Text,
  useToast,
} from "@chakra-ui/react";
import Web3 from "web3";

let web3 = undefined; // Will hold the web3 instance

setDefaultBreakpoints([{ xs: 0 }, { l: 1199 }, { xl: 1200 }]);

const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => {
      // the object returned here is passed to the
      // anchor element's props
      return {
        className: isCurrent ? "active" : "non-active",
      };
    }}
  />
);

const Header = function ({ className }) {
  const [openMenu, setOpenMenu] = React.useState(false);
  const [loading, setLoading] = useState(false); // Loading button state
  const [accessToken, setAccessToken] = useState('');

  const toast = useToast();

  // UI operation part
  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };
  const closeMenu = () => {
    setOpenMenu(false);
  };

  const ref = useOnclickOutside(() => {
    closeMenu();
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2 } = useDisclosure();

  const [showmenu, btn_icon] = useState(false);
  const [showpop, btn_icon_pop] = useState(false);
  const [shownot, btn_icon_not] = useState(false);
  const closePop = () => {
    btn_icon_pop(false);
  };
  const closeNot = () => {
    btn_icon_not(false);
  };
  const refpop = useOnclickOutside(() => {
    closePop();
  });
  const refpopnot = useOnclickOutside(() => {
    closeNot();
  });

  // Authentication part
  const handleAuthenticate = (publicAddress, signature) =>
    fetch(`${process.env.REACT_APP_BACKEND_URL}/vega/ethsign`, {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());

  const handleSignMessage = async (public_address, nonce) => {
    try {
      const signature = await web3.eth.personal.sign(
        `I am signing into vega NFT marketplace with my one-time nonce: ${nonce}`,
        public_address,
        "" // MetaMask will ignore the password argument here
      );
      onClose();
      return { public_address, signature };
    } catch (err) {
      toast({
        title: err.message,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
      return false;
    }
  };

  const handleSignup = (publicAddress) => {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/vega/createuser`, {
      body: JSON.stringify({ public_address: publicAddress }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    }).then((response) => response.json());
  };

  const connectMetamask = async () => {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      toast({
        title: "Please install MetaMask first.",
        status: "info",
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    if (!web3) {
      try {
        // Request account access if needed
        await window.ethereum.enable();

        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3(window.ethereum);
      } catch (error) {
        toast({
          title: "You need to allow MetaMask.",
          status: "info",
          position: "top-right",
          isClosable: true,
        });
        return;
      }
    }
    const coinbase = await web3.eth.getCoinbase();
    if (!coinbase) {
      toast({
        title: "Please activate MetaMask first.",
        status: "info",
        position: "top-right",
        isClosable: true,
      });
      return;
    }

    const publicAddress = coinbase.toLowerCase();
    setLoading(true);

    // Look if user with current publicAddress is already present on backend
    var user_obj = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/vega/singleuser?publicAddress=${publicAddress}`
    ).then((response) => response.json());
    
    let current_user =
      user_obj.user.length && user_obj.user.length != 0
        ? {'public_address':user_obj.user[0].public_address, 'nonce':user_obj.user[0].nonce}
        : await handleSignup(publicAddress);
    // Popup MetaMask confirmation modal to sign message
    debugger;
    let signature_obj = await handleSignMessage(current_user.public_address, current_user.nonce);
    if(signature_obj) {
      let tokenResult = await handleAuthenticate(signature_obj.public_address, signature_obj.signature);
      
      setAccessToken(tokenResult.access_token);
      onOpen2();
    }
  };

  useEffect(() => {
    const header = document.getElementById("myHeader");
    const totop = document.getElementById("scroll-to-top");
    const sticky = header.offsetTop;
    const scrollCallBack = window.addEventListener("scroll", () => {
      btn_icon(false);
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        totop.classList.add("show");
      } else {
        header.classList.remove("sticky");
        totop.classList.remove("show");
      }
      if (window.pageYOffset > sticky) {
        closeMenu();
      }
    });
    return () => {
      window.removeEventListener("scroll", scrollCallBack);
    };
  }, []);
  return (
    <header className={`navbar white ${className}`} id="myHeader">
      <div className="container">
        <div className="row w-100-nav">
          <div className="logo px-0">
            <div className="navbar-title navbar-item">
              <NavLink to="/">
                <Image src="/img/logos/logo-red.png" boxSize="55px" alt="#" />
              </NavLink>
            </div>
          </div>

          <div className="search">
            <input
              id="quick_search"
              className="xs-hide"
              name="quick_search"
              placeholder="search item here..."
              type="text"
            />
          </div>

          <BreakpointProvider>
            <Breakpoint l down>
              {showmenu && (
                <div className="menu">
                  <div className="navbar-item">
                    <NavLink to="/explore" onClick={() => btn_icon(!showmenu)}>
                      Explore
                      <span className="lines"></span>
                    </NavLink>
                  </div>
                  <div className="navbar-item">
                    <NavLink to="/create" onClick={() => btn_icon(!showmenu)}>
                      Create
                      <span className="lines"></span>
                    </NavLink>
                  </div>
                  <div className="navbar-item">
                    <div ref={ref}>
                      <div
                        className="dropdown-custom dropdown-toggle btn"
                        onMouseEnter={handleMenuOpen}
                        onMouseLeave={closeMenu}
                      >
                        Stats
                        <span className="lines"></span>
                        {openMenu && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeMenu}>
                              <NavLink
                                to="/rankings"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Rankings
                              </NavLink>
                              <NavLink
                                to="/activity"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Activity
                              </NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Breakpoint>

            <Breakpoint xl>
              <div className="menu">
                <div className="menu">
                  <div className="navbar-item">
                    <NavLink to="/explore" onClick={() => btn_icon(!showmenu)}>
                      Explore
                      <span className="lines"></span>
                    </NavLink>
                  </div>
                  <div className="navbar-item">
                    <NavLink to="/create" onClick={() => btn_icon(!showmenu)}>
                      Create
                      <span className="lines"></span>
                    </NavLink>
                  </div>
                  <div className="navbar-item">
                    <div ref={ref}>
                      <div
                        className="dropdown-custom dropdown-toggle btn"
                        onMouseEnter={handleMenuOpen}
                        onMouseLeave={closeMenu}
                      >
                        Stats
                        <span className="lines"></span>
                        {openMenu && (
                          <div className="item-dropdown">
                            <div className="dropdown" onClick={closeMenu}>
                              <NavLink
                                to="/ranking"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Rankings
                              </NavLink>
                              <NavLink
                                to="/activity"
                                onClick={() => btn_icon(!showmenu)}
                              >
                                Activity
                              </NavLink>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Breakpoint>
          </BreakpointProvider>

          <div className="mainside">
            <div className="connect-wal">
              <Button colorScheme="red" onClick={onOpen}>
                Connect Wallet
              </Button>
            </div>
            <div className="logout">
              <div
                id="de-click-menu-notification"
                className="de-menu-notification"
                onClick={() => btn_icon_not(!shownot)}
                ref={refpopnot}
              >
                <div className="d-count">8</div>
                <i className="fa fa-bell"></i>
                {shownot && (
                  <div className="popshow">
                    <div className="de-flex">
                      <h4>Notifications</h4>
                      <span className="viewaall">Show all</span>
                    </div>
                    <ul>
                      <li>
                        <div className="mainnot">
                          <img
                            className="lazy"
                            src="../../img/author/author-2.jpg"
                            alt=""
                          />
                          <div className="d-desc">
                            <span className="d-name">
                              <b>Mamie Barnett</b> started following you
                            </span>
                            <span className="d-time">1 hour ago</span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="mainnot">
                          <img
                            className="lazy"
                            src="../../img/author/author-3.jpg"
                            alt=""
                          />
                          <div className="d-desc">
                            <span className="d-name">
                              <b>Nicholas Daniels</b> liked your item
                            </span>
                            <span className="d-time">2 hours ago</span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="mainnot">
                          <img
                            className="lazy"
                            src="../../img/author/author-4.jpg"
                            alt=""
                          />
                          <div className="d-desc">
                            <span className="d-name">
                              <b>Lori Hart</b> started following you
                            </span>
                            <span className="d-time">18 hours ago</span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="mainnot">
                          <img
                            className="lazy"
                            src="../../img/author/author-5.jpg"
                            alt=""
                          />
                          <div className="d-desc">
                            <span className="d-name">
                              <b>Jimmy Wright</b> liked your item
                            </span>
                            <span className="d-time">1 day ago</span>
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="mainnot">
                          <img
                            className="lazy"
                            src="../../img/author/author-6.jpg"
                            alt=""
                          />
                          <div className="d-desc">
                            <span className="d-name">
                              <b>Karla Sharp</b> started following you
                            </span>
                            <span className="d-time">3 days ago</span>
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              <div
                id="de-click-menu-profile"
                className="de-menu-profile"
                onClick={() => btn_icon_pop(!showpop)}
                ref={refpop}
              >
                <img
                  src="../../img/author_single/author_thumbnail.jpg"
                  alt=""
                />
                {showpop && (
                  <div className="popshow">
                    <div className="d-name">
                      <h4>Monica Lucas</h4>
                      <span
                        className="name"
                        onClick={() => window.open("", "_self")}
                      >
                        Set display name
                      </span>
                    </div>
                    <div className="d-balance">
                      <h4>Balance</h4>
                      12.858 ETH
                    </div>
                    <div className="d-wallet">
                      <h4>My Wallet</h4>
                      <span id="wallet" className="d-wallet-address">
                        DdzFFzCqrhshMSxb9oW3mRo4MJrQkusV3fGFSTwaiu4wPBqMryA9DYVJCkW9n7twCffG5f5wX2sSkoDXGiZB1HPa7K7f865Kk4LqnrME
                      </span>
                      <button id="btn_copy" title="Copy Text">
                        Copy
                      </button>
                    </div>
                    <div className="d-line"></div>
                    <ul className="de-submenu-profile">
                      <li>
                        <span>
                          <i className="fa fa-user"></i> My profile
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-pencil"></i> Edit profile
                        </span>
                      </li>
                      <li>
                        <span>
                          <i className="fa fa-sign-out"></i> Sign out
                        </span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent py="2">
          <ModalHeader>Connect Your Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
            <Text>
              Connect with one of available wallet providers or create a new
              wallet.
            </Text>
            <Button
              colorScheme="pink"
              my="3"
              leftIcon={<Image src="/img/wallet/1.png" boxSize="20px"></Image>}
              onClick={connectMetamask}
            >
              Connect to Metamask
            </Button>
            <Text>
              We do not own private keys and cannot access your funds without
              your confirmation
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" variant="outline" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={isOpen2} onClose={onClose2}>
        <ModalOverlay />
        <ModalContent py="2">
          <ModalHeader>Congratulations</ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign="center">
          <Text fontSize='lg'  mb="3" fontWeight="bold">
              This is the accessToken generated using jwt.
            </Text>
            <Text>
              {accessToken}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" variant="outline" onClick={onClose2}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </header>
  );
};
export default Header;
