import {createSelector} from 'reselect';
import RSS from '../reducers/rss-state';

function getRssState(state) {
  return state.rssState;
}

const getRssColor = createSelector(
  getRssState,
  rssState => {
    switch (rssState) {
      case RSS.NORMAL:
        return '';
      case RSS.WORKING:
        return 'black';
      case RSS.FAILED:
        return 'red';
      default:
        throw 'getRssColor invalid input';
    }
  } 
);

export default getRssColor;
