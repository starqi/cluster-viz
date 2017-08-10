function rssState(state = rssState.NORMAL, action) {
  switch (action.type) {
    case 'BEGIN_RSS':
      return rssState.WORKING;
    case 'END_RSS':
      return rssState.NORMAL;
    case 'ERROR_RSS':
      return rssState.FAILED;
    default:
      return state;
  }
}

rssState.NORMAL = Symbol();
rssState.WORKING = Symbol();
rssState.FAILED = Symbol();

export default rssState;
