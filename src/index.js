import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import './style.css';
import tuxIconUrl from './tux.png';

function Test(props) {
  return (
    <div>
      <h1 className='redify'>{_.join(['Hello', props.children])}</h1>
      <img src={props.src}></img>
    </div>
  );
}

ReactDOM.render(
  <Test src={tuxIconUrl}>test</Test>,
  document.getElementById('root')
);
