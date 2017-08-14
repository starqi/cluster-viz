import {connect} from 'react-redux';
import Clusters from '../components/clusters.js';

function makeMapStateToProps() {
  return state => _.pick(state, ['clusters']);
}

export default connect(makeMapStateToProps)(Clusters);
