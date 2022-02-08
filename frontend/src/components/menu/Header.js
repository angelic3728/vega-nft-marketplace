import Cookies from "universal-cookie";
import React, { useEffect, useState } from "react";
// import { navigate } from "@reach/router";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../store/actions";
import Breakpoint, {
  BreakpointProvider,
  setDefaultBreakpoints,
} from "react-socks";
import { Link } from "@reach/router";
import useOnclickOutside from "react-cool-onclickoutside";
import * as selectors from "../../store/selectors";
import { fetchAuthInfo } from "../../store/actions/thunks";
import ConnectWalletButton from "../../items/ConnectWalletButton";
import SignoutElement from "../../items/SignoutElement";

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

const Header = function (props) {
  const [openMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();
  const accessTokenState = useSelector(selectors.accessTokenState);
  const authInfoState = useSelector(selectors.authInfoState);
  const authStatusState = useSelector(selectors.authStatusState);
  const cookies = new Cookies();

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

  const accessToken = accessTokenState.data
    ? accessTokenState.access_token
    : "";
  const authInfo = authInfoState.data ? authInfoState.data : {};
  const authStatus = authStatusState ? authStatusState : false;
  // Authentication part

  const handleScroll = () => {
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
  };

  useEffect(() => {
    const accessToken = cookies.get(process.env.REACT_APP_TOKEN_COOKIE_NAME);
    dispatch(actions.getAccessToken.success(accessToken));
    if (accessToken) {
      const publicAddress = cookies.get(
        process.env.REACT_APP_ADDRESS_COOKIE_NAME
      );
      dispatch(fetchAuthInfo(publicAddress));
    }

    handleScroll();
  }, []);

  useEffect(() => {
    const publicAddress = cookies.get(
      process.env.REACT_APP_ADDRESS_COOKIE_NAME
    );
    if (publicAddress !== undefined) dispatch(fetchAuthInfo(publicAddress));
  }, [accessToken]);

  return (
    <header className={`navbar white ${props.className}`} id="myHeader">
      <div className="container">
        <div className="row w-100-nav">
          <div className="logo px-0">
            <div className="navbar-title navbar-item">
              <NavLink to="/">
                <img src="/img/logos/logo-red.png" width="55px" alt="#" />
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
                    <NavLink to="/create">
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
                    <NavLink
                      to="/create"
                    >
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
            {!authStatus && (
              <div className="connect-wal">
                <ConnectWalletButton />
              </div>
            )}
            {authStatus && (
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
                          {authInfo.public_address}
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
                          <SignoutElement />
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <button className="nav-icon" onClick={() => btn_icon(!showmenu)}>
          <div className="menu-line white"></div>
          <div className="menu-line1 white"></div>
          <div className="menu-line2 white"></div>
        </button>
      </div>
    </header>
  );
};
export default Header;
