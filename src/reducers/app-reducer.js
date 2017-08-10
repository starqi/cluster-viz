import {combineReducers} from 'redux';
import tds from './tds';
import rssState from './rss-state';
import isSubmitting from './is-submitting';

const appReducer = combineReducers({
  tds, rssState, isSubmitting
});

export default appReducer;
