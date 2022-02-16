import React from "react";
import { useSelector } from "react-redux";
import { Router, Redirect } from "@reach/router";
import PrivateRoute from "./securityRouter/PrivateRoute";
import ScrollToTopBtn from "./menu/ScrollToTop";
import Header from "./menu/Header";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Ranking from "./pages/Ranking";
import Auction from "./pages/Auction";
import HelpCenter from "./pages/HelpCenter";
import Collection from "./pages/Collection";
import ItemDetail from "./pages/ItemDetail";
import Author from "./pages/Author";
import Login from "./pages/Login";
import Register from "./pages/Register";
import News from "./pages/News";
import NewsSingle from "./pages/NewsSingle";
import Create from "./pages/Create";
import Activity from "./pages/Activity";
import Contact from "./pages/Contact";
import * as selectors from "../store/selectors";

import useEagerConnect from "../hooks/useEagerConnect";
import { ToastListener } from "../contexts/ToastsContext";
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0, 0), [location]);
  return children;
};

function GlobalHooks() {
  useEagerConnect();
  return null;
}

const App = () => {
  const authStatusState = useSelector(selectors.authStatusState);
  const authStatus = authStatusState ? authStatusState : false;

  return (
    <div className="wraper">
      <GlobalStyles />
      <GlobalHooks />
      <ToastListener />
      <Header />
      <ScrollTop path="/">
        <Router>
          <Home exact path="/">
            <Redirect to="/home" />
          </Home>
          <Explore path="/explore" />
          <Ranking path="/ranking" />
          <Auction path="/auction" />
          <HelpCenter path="/helpcenter" />
          <Collection path="/collection/:collectionId" />
          <ItemDetail path="/itemdetail/:nftId" />
          <Author path="/author/:authorId" />
          <Login path="/login" />
          <Register path="/register" />
          <News path="/news" />
          <NewsSingle path="/news/:postId" />
          <Activity path="/activity" />
          <Contact path="/contact" />
          <PrivateRoute comp={<Create />} isAuthenticated={authStatus} path="/create">
          </PrivateRoute>
        </Router>
      </ScrollTop>
      <ScrollToTopBtn />
    </div>
  );
};
export default App;
