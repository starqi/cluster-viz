import 'bootstrap/dist/css/bootstrap.min.css';
import * as Bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import React from 'react';
import PropTypes from 'prop-types';
//
import '../css/stuff.css';
import tuxIconUrl from '../images/tux.png';
import TdAdder from './td-adder';
import TdList from './td-list';
import WaitingModal from './waiting-modal';

// The main app
const App = ({tds, rssColor, isSubmitDisabled, isSubmitting, onAdd, onRss, onDelete, onSubmit, onTextLoseFocus}) => (
  <div>
    <div id='myTitle'> 
      <div className='inlinedDiv'>
        <h1>Cluster</h1>
      </div>
      <div className='inlinedDiv'>
        <img id='myLogo' className='img-circle' src={tuxIconUrl}></img>
      </div>
      <div className='inlinedDiv'>
        <h1>Viz</h1>
      </div>
    </div>
    <TdAdder 
      onAdd={onAdd} onRss={onRss} onSubmit={onSubmit}
      rssColor={rssColor} isSubmitDisabled={isSubmitDisabled}/>
    <TdList tds={tds} onDelete={onDelete} onTextLoseFocus={onTextLoseFocus}/>
    <WaitingModal title='' show={isSubmitting}>
      Processing
    </WaitingModal>
  </div>
);

App.propTypes = {
  tds: PropTypes.array.isRequired,
  rssColor: PropTypes.string.isRequired,
  isSubmitDisabled: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onAdd: PropTypes.func,
  onRss: PropTypes.func,
  onDelete: PropTypes.func,
  onSubmit: PropTypes.func,
  onTextLoseFocus: PropTypes.func
};

export default App;
