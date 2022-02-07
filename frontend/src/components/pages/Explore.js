import React from 'react';
import ColumnNewThreeColRedux from '../partials/Explore/ColumnNewThreeColRedux';
import Footer from '../partials/Footer';
import CheckboxFilter from '../partials/Explore/CheckboxFilter';

//IMPORT DYNAMIC STYLED COMPONENT
import { StyledHeader } from '../Styles';
//SWITCH VARIABLE FOR PAGE STYLE
const theme = 'GREY'; //LIGHT, GREY, RETRO


const Explore= () => (
<div className="greyscheme">
<StyledHeader theme={theme} />
  <section className='container'>
        <div className='row'>
        <div className="spacer-double"></div>
          <div className='col-md-3'>
            <CheckboxFilter />
          </div>
          <div className="col-md-9">
            <ColumnNewThreeColRedux/>
          </div>
        </div>
      </section>


  <Footer />
</div>

);
export default Explore;
