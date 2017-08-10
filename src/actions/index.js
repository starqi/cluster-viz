export function addTd(td) {
  return {type: 'ADD_TD', td};
}

export function updateTd(td) {
  return {type: 'UPDATE_TD', td};
}

export function deleteTd(id) {
  return {type: 'DELETE_TD', id};
}

export function beginRss() {
  return {type: 'BEGIN_RSS'};
}

export function endRss() {
  return {type: 'END_RSS'};
}

export function beginErrorRss() {
  return {type: 'ERROR_RSS'};
}

export function flashErrorRss() {
  return (dispatch, getState) => {
    dispatch(beginErrorRss());
    setTimeout(() => {
      dispatch(endRss());
    }, 500);
  };
}

export function requestRss(url) {
  return (dispatch, getState) => {
    dispatch(beginRss());
    $.get('rss', {url}).done(data => {
      console.log('RSS success');
      data.forEach(td => {
        dispatch(addTd(td));
      });
      dispatch(endRss());
    }).fail(() => {
      console.log('RSS failed');
      dispatch(flashErrorRss());
    });
  };
}

export function beginSubmit() {
  return {type: 'BEGIN_SUBMIT'};
}

export function endSubmit() {
  return {type: 'END_SUBMIT'};
}

const PAD_TIME = 1500; // Show off the loading pop up
export function submit() {
  return (dispatch, getState) => {
    dispatch(beginSubmit());
    setTimeout(() => {
      $.ajax({
        type: 'POST',
        url: 'cluster',
        data: JSON.stringify(_.pick(getState(), ['tds'])),
        contentType: 'application/json',
        dataType: 'json'
      }).done(data => {
        console.log('Cluster success');
        // If we follow the official advice and view the router as a separate source of truth
        // then it makes sense to interpret this as changing the router state.
        window.location.replace('/#/cluster');
        dispatch(endSubmit());
      }).fail(() => {
        console.log('Cluster failed');
        window.location.replace('/#/cluster-fail');
        dispatch(endSubmit());
      });
    }, PAD_TIME);
  };
}
