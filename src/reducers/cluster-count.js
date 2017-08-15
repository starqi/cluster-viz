function clusterCount(state = 1, action) {
  switch (action.type) {
    case 'UPDATE_CLUSTER_COUNT':
      return action.num;
    default:
      return state;
  }
}

export default clusterCount;
