function clusters(state = [], action) {
  switch (action.type) {
    case 'SET_CLUSTER_DATA':
      return action.data;
    default:
      return state;
  }
}

export default clusters;
