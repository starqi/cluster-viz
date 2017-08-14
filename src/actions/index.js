import _ from 'lodash';

var idCounter = 0;
export function addTd(td) {
  return {type: 'ADD_TD', td: Object.assign({id: idCounter++}, td)};
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

export function setClusterData(data) {
  return {type: 'SET_CLUSTER_DATA', data};
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
        dispatch(setClusterData(data.clusters));
        window.location.replace('/#/cluster'); // Treat router as 2nd store
        dispatch(endSubmit());
      }).fail(() => {
        console.log('Cluster failed');
        alert('Unknown server error. LOL!');
        dispatch(endSubmit());
      });
    }, PAD_TIME);
  };
}

