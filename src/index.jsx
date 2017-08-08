import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';
import {createStore, applyMiddleware} from 'redux';
import {connect, Provider} from 'react-redux';
import ReactThunk from 'redux-thunk';
import {createSelector} from 'reselect';

// ---

import './index.css';
import tuxIconUrl from './tux.png';

//////////////////////
// Redux 

// <Action creators>

function addTD(td) {
  return {type: 'ADD_TD', td};
}

function deleteTD(id) {
  return {type: 'DELETE_TD', id};
}

function beginRSS() {
  return {type: 'BEGIN_RSS'};
}

function endRSS() {
  return {type: 'END_RSS'};
}

function requestRSS(url) {
  return (dispatch, getState) => {
    setTimeout(() => {
      dispatch(addTD({title: 'a', description: 'a'}));
      dispatch(addTD({title: 'b', description: 'b'}));
      dispatch(addTD({title: 'c', description: 'c'}));
      dispatch(endRSS());
    }, 1000);
    dispatch(beginRSS());
  };
}

// <Reducers>

const defaultState = {
  tds: [],
  idCounter: 0
};

function mainReducer(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_TD':
      const tdWithID = Object.assign({}, action.td, {id: state.idCounter});
      console.log(tdWithID);
      return Object.assign({}, state, {
        tds: [...state.tds, tdWithID],
        idCounter: state.idCounter + 1
      });
    case 'DELETE_TD':
      return Object.assign({}, state, {
        tds: state.tds.filter((a) => a.id != action.id)
      });
    case 'BEGIN_RSS':
      console.log('Not implemented yet! Start RSS loading screen');
      return state;
    case 'END_RSS':
      console.log('Not implemented yet! End RSS loading screen');
      return state;
    default:
      return state;
  }
}

//////////////////////
// React views

// A single deletable pair - title & description
// [Props: children - the description, title, onDeleteSignal, id]
class TitleDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      description: props.children
    };
    this.onTitleChange = this.onTitleChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
    this.onDeleteClick = this.onDeleteClick.bind(this);
  }

  onDeleteClick(e) {
    this.props.onDeleteSignal(this.props.id);
  }
  onTitleChange(e) {
    this.setState({title: e.target.value});
  }
  onDescriptionChange(e) {
    this.setState({description: e.target.value});
  }

  render() {
    return (
      <div className='panel panel-default someVerticalPadding'>
        <div className='panel-body'>
          <form className='formNoBottom'>
            <div className='form-group'> 
              <label>Title</label>
              <input className='form-control' value={this.state.title} onChange={this.onTitleChange}></input>
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea className='myTextArea form-control' value={this.state.description} onChange={this.onDescriptionChange}></textarea>
            </div>
            <button className='btn btn-primary' onClick={this.onDeleteClick}>Delete</button>
          </form>
        </div>
      </div>
    );
  }
}

// A text prompt that disappears when submitted, initially invisible
// [Props: visible, buttonLabel, onClick]
class SimplePrompt extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onChange(e) {
    this.setState({value: e.target.value});
  }
  onClick(e) {
    this.props.onClick(this.state.value);
    this.setState({value: ''});
  }

  render() {
    return (
      <div style={{display: this.props.visible ? 'block' : 'none', backgroundColor: '#ddf8ff'}} 
        className='panel panel-default someVerticalPadding'>
        <div className='panel-body'>
          <button 
            style={{float: 'right'}}
            className='btn btn-primary someHorizontalPadding' onClick={this.onClick}>
            {this.props.buttonLabel}
          </button>
          <div style={{overflow: 'hidden'}}>
            <input 
              style={{width: '100%'}}
              className='form-control' 
              value={this.state.value} 
              onChange={this.onChange}></input>
          </div>
        </div>
      </div>
    );
  }
}

// Two add buttons for adding a new box or importing an RSS feed
// [Props: onAdd, onRSS]
class TDAdder extends React.Component {
  constructor(props) {
    super(props);
    this.onAddClick = this.onAddClick.bind(this);
    this.onRSSClick = this.onRSSClick.bind(this);
    this.onPromptClick = this.onPromptClick.bind(this);
    this.state = {
      promptVisible: false
    };
  }

  onPromptClick(url) {
    this.setState({promptVisible: false});
    this.props.onRSS(url);
  }

  onAddClick(e) {
    this.props.onAdd();
  }

  onRSSClick(e) {
    this.setState((prevState) => {return {promptVisible: !prevState.promptVisible}});
  }

  render() {
    return (
      <div className='somePadding'>
        <div style={{textAlign: 'center'}}>
          <button className='btn btn-info' onClick={this.onAddClick}>+</button>
          <button className='someHorizontalPadding btn btn-info' onClick={this.onRSSClick}>RSS</button>
        </div>
        <SimplePrompt 
          buttonLabel='Add' 
          visible={this.state.promptVisible} 
          onClick={this.onPromptClick} />
      </div>
    );
  }
}

// A list of TitleDescriptions
// [Props: tds - list of {title, description, id}, onDelete]
function TDList(props) {
  return (
    <div className='somePadding'>
      {props.tds.map((a) => 
        <TitleDescription 
          key={a.id} id={a.id}
          onDeleteSignal={props.onDelete}
          title={a.title}>{a.description}</TitleDescription>
      )}
    </div>
  );
}

// The main app
// [Props: tds - list of {title, description, id}, onAdd, onRSS, onDelete]
function App(props) {
  return (
    <div>
      <div id='myTitle'> 
        <div className='inlinedDiv'>
          <h1>Interest</h1>
        </div>
        <div className='inlinedDiv'>
          <img id='myLogo' className='img-circle' src={tuxIconUrl}></img>
        </div>
        <div className='inlinedDiv'>
          <h1>Summarizer</h1>
        </div>
      </div>
      <TDAdder onAdd={props.onAdd} onRSS={props.onRSS} />
      <TDList tds={props.tds} onDelete={props.onDelete} />
    </div>
  );
}

////////////////////////
// React-redux

function mapStateToProps({ tds }) {
  return { tds };
}

function mapDispatchToProps(dispatch) {
  return {
    onAdd: () => {
      dispatch(addTD({title: '', description: ''}));
    },
    onRSS: (url) => {
      dispatch(requestRSS(url));
    },
    onDelete: (id) => {
      dispatch(deleteTD(id));
    }
  };
}

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);

////////////////////
// Run

let store = createStore(mainReducer, applyMiddleware(ReactThunk));

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
