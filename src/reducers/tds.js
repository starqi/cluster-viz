function tds(state = {array: [], idCounter: 0}, action) {
  switch (action.type) {
    case 'ADD_TD':
      const tdWithId = Object.assign({}, action.td, {id: state.idCounter});
      return {
        array: [tdWithId, ...state.array],
        idCounter: state.idCounter + 1
      };
    case 'UPDATE_TD':
      return {
        array: state.array.map(a => a.id === action.td.id ? action.td : a),
        idCounter: state.idCounter
      };
    case 'DELETE_TD':
      return {
        array: state.array.filter(a => a.id !== action.id),
        idCounter: state.idCounter
      };
    default:
      return state;
  }
}

export default tds;
