import {combineReducers} from 'redux';
import tds from './tds';
import rssState from './rss-state';
import isSubmitting from './is-submitting';
import clusters from './clusters';

const appReducer = combineReducers({
  tds, rssState, isSubmitting, clusters
});

export default appReducer;
