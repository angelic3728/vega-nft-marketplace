import React from "react";
import { Router, Location, Redirect } from "@reach/router";
import ScrollToTopBtn from "./menu/ScrollToTop";
import Header from "./menu/Header";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Ranking from "./pages/Ranking";
import Auction from "./pages/Auction";
import HelpCenter from "./pages/HelpCenter";
import Collection from './pages/Collection';
import ItemDetail from './pages/ItemDetail';
import Author from './pages/Author';
import Login from './pages/Login';
import Register from './pages/Register';
import News from './pages/News';
import NewsSingle from './pages/NewsSingle';
import Create from './pages/Create';
import Activity from './pages/Activity';
import Contact from './pages/Contact';
import Minter from './pages/Minter';

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

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id="routerhang">
        <div key={location.key}>
          <Router location={location}>{children}</Router>
        </div>
      </div>
    )}
  </Location>
);

const App = () => (
  <div className="wraper">
    <GlobalStyles />
    <Header />
    <PosedRouter>
      <ScrollTop path="/">
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
        <Create path="/create" />
        <Activity path="/activity" />
        <Contact path="/contact" />
        <Minter path="/mint" />
      </ScrollTop>
    </PosedRouter>
    <ScrollToTopBtn />
  </div>
);
export default App;
