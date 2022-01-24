import React from 'react';
import Particle from '../partials/Home/Particle';
import SliderMainParticleGrey from '../partials/Home/SliderMainParticle';
import FeatureBox from '../partials/Home/FeatureBox';
import CarouselCollectionRedux from '../partials/Home/CarouselCollectionRedux';
import CarouselNewRedux from '../partials/Home/CarouselNewRedux';
import AuthorListRedux from '../partials/Home/AuthorListRedux';
import Footer from '../partials/Footer';

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO

const Home= () => (
  <div className="greyscheme">
  <StyledHeader theme={theme} />
      <section className="jumbotron no-bg relative" style={{backgroundImage: `url(${'./img/background/8.jpg'})`}}>
       <Particle/>
         <SliderMainParticleGrey/>
      </section>

      <section className='container no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12 mb-2'>
              <h2>New Items</h2>
          </div>
        </div> 
        <CarouselNewRedux/>
      </section>

      <section className='container no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12'>
              <h2>Top Sellers</h2>
          </div>
          <div className='col-lg-12'>
            <AuthorListRedux/>
          </div>
        </div>
      </section>

      <section className='container no-top no-bottom'>
        <div className='row'>
          <div className="spacer-double"></div>
          <div className='col-lg-12 mb-2'>
              <h2>Hot Collections</h2>
          </div>
            <div className='col-lg-12'>
              <CarouselCollectionRedux/>
            </div>
          </div>
      </section>

      <section className='container no-top'>
        <div className='row'>
            <div className="spacer-double"></div>
            <div className='col-lg-12 mb-3'>
              <h2>Create and Sell Now</h2>
            </div>
            <FeatureBox/>
        </div>
      </section>

    <Footer />

  </div>
);
export default Home;
