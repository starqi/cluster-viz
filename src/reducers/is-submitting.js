function isSubmitting(state = false, action) {
  switch (action.type) {
    case 'BEGIN_SUBMIT':
      return true;
    case 'END_SUBMIT':
      return false;
    default:
      return state;
  }
}

export default isSubmitting;
