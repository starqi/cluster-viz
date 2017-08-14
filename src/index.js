import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import ReactThunk from 'redux-thunk';
import {HashRouter, Switch, Route} from 'react-router-dom';

import appReducer from './reducers/app-reducer';
import ClustersContainer from './containers/clusters-container';
import AppContainer from './containers/app-container';

let store = createStore(appReducer, applyMiddleware(ReactThunk));

$('body').append($('<div></div>', {id: 'root'}));

ReactDOM.render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/cluster' component={ClustersContainer}/>
        <Route path='/' component={AppContainer}/>
      </Switch>
    </HashRouter>
  </Provider>,
  $('#root')[0]
);
