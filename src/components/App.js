import React from 'react';
import { Router, Location, Redirect } from '@reach/router';
import ScrollToTopBtn from './menu/ScrollToTop';
import Header from './menu/Header';
import Home from './pages/Home';
import Explore from './pages/Explore';
import Ranking from './pages/Ranking';
import Auction from './pages/Auction';
import HelpCenter from './pages/HelpCenter';
// import Colection from './pages/colection';
// import ItemDetailRedux from './pages/ItemDetailRedux';
// import Author from './pages/Author';
// import AuthorOpensea from './pages/Opensea/author';
// import Login from './pages/login';
// import Register from './pages/register';
// import Price from './pages/price';
// import Works from './pages/works';
// import News from './pages/news';
// import NewsSingle from './pages/newsSingle';
// import Create from './pages/create';
// import Activity from './pages/activity';
// import Contact from './pages/contact';
// import Minter from './pages/Minter';

import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  :root {
    scroll-behavior: unset;
  }
`;

export const ScrollTop = ({ children, location }) => {
  React.useEffect(() => window.scrollTo(0,0), [location])
  return children
}

const PosedRouter = ({ children }) => (
  <Location>
    {({ location }) => (
      <div id='routerhang'>
        <div key={location.key}>
          <Router location={location}>
            {children}
          </Router>
        </div>
      </div>
    )}
  </Location>
);

const App= () => (
  <div className="wraper">
  <GlobalStyles />
    <Header/>
      <PosedRouter>
      <ScrollTop path="/">
        <Home exact path="/">
          <Redirect to="/home" />
        </Home>
        <Explore path="/explore" />
        {/* <ExploreOpensea path="/exploreOpensea" /> */}
        <Ranking path="/rangking" />
        <Auction path="/Auction" />
        <HelpCenter path="/helpcenter" />
        </ScrollTop>
      </PosedRouter>
    <ScrollToTopBtn />
  </div>
);
export default App;

{/* <Colection path="/colection/:collectionId" />
        <ItemDetailRedux path="/ItemDetail/:nftId" />
        <Author path="/Author/:authorId" />
        <AuthorOpensea path="/AuthorOpensea" />
        <Login path="/login" />
        <Register path="/register" />
        <Price path="/price" />
        <Works path="/works" />
        <News path="/news" />
        <NewsSingle path="/news/:postId" />
        <Create path="/create" />
        <Activity path="/activity" />
        <Contact path="/contact" />
        <Minter path="/mint" /> */}