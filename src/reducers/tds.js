function tds(state = [], action) {
  switch (action.type) {
    case 'ADD_TD':
      return [action.td, ...state];
    case 'UPDATE_TD':
      let copy = state.slice();
      const index = state.findIndex(a => a.id === action.td.id);
      Object.assign(copy[index], action.td);
    case 'DELETE_TD':
      return state.filter(a => a.id !== action.id);
    default:
      return state;
  }
}

export default tds;
