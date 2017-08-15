import {combineReducers} from 'redux';
import tds from './tds';
import rssState from './rss-state';
import isSubmitting from './is-submitting';
import clusters from './clusters';
import clusterCount from './cluster-count';

const appReducer = combineReducers({
  tds, rssState, isSubmitting, clusters, clusterCount
});

export default appReducer;
