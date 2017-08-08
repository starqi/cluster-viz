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

function beginRss() {
  return {type: 'BEGIN_RSS'};
}

function endRss() {
  return {type: 'END_RSS'};
}

function errorRss() {
  return {type: 'ERROR_RSS'};
}

function flashErrorRss() {
  return (dispatch, getState) => {
    dispatch(errorRss());
    setTimeout(() => {
      dispatch(endRss());
    }, 500);
  };
}

function requestRss(url) {
  return (dispatch, getState) => {
    dispatch(beginRss());
    $.get('rss', {url}).done((data) => {
      console.log('RSS success');
      data.forEach((td) => {
        dispatch(addTD(td));
      });
      dispatch(endRss());
    }).fail(() => {
      console.log('RSS failed');
      dispatch(flashErrorRss());
    });
  };
}

// <Reducers>

const RSS_NORMAL = 0, RSS_WORKING = 1, RSS_FAILED = 2;

const defaultState = {
  tds: [],
  idCounter: 0,
  rssState: RSS_NORMAL
};

function mainReducer(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_TD':
      const tdWithID = Object.assign({}, action.td, {id: state.idCounter});
      return Object.assign({}, state, {
        tds: [...state.tds, tdWithID],
        idCounter: state.idCounter + 1
      });
    case 'DELETE_TD':
      return Object.assign({}, state, {
        tds: state.tds.filter((a) => a.id != action.id)
      });
    case 'BEGIN_RSS':
      return Object.assign({}, state, {
        rssState: RSS_WORKING
      });
    case 'END_RSS':
      return Object.assign({}, state, {
        rssState: RSS_NORMAL
      });
      return state;
    case 'ERROR_RSS':
      return Object.assign({}, state, {
        rssState: RSS_FAILED
      });
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
    this.onKeyDown = this.onKeyDown.bind(this);
    this.tryFinishPrompt = this.tryFinishPrompt.bind(this);
  }

  onChange(e) {
    this.setState({value: e.target.value});
  }

  onKeyDown(e) {
    if (e.keyCode === 13) {
      this.tryFinishPrompt();
    }
  }

  onClick(e) {
    this.tryFinishPrompt();
  }

  tryFinishPrompt() {
    if (this.state.value.trim() == '') return;
    this.props.onClick(this.state.value);
    this.setState({value: ''});
  }

  componentDidUpdate() {
    if (this.props.visible) {
      this.domRef.focus();
    }
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
              ref={(a) => this.domRef = a}
              style={{width: '100%'}}
              className='form-control' 
              value={this.state.value} 
              onKeyDown={this.onKeyDown}
              onChange={this.onChange}></input>
          </div>
        </div>
      </div>
    );
  }
}

// Two add buttons for adding a new box or importing an RSS feed
// [Props: onAdd, onRss, rssColor]
class TDAdder extends React.Component {
  constructor(props) {
    super(props);
    this.onAddClick = this.onAddClick.bind(this);
    this.onRssClick = this.onRssClick.bind(this);
    this.onPromptClick = this.onPromptClick.bind(this);
    this.state = {
      promptVisible: false
    };
  }

  onPromptClick(url) {
    this.setState({promptVisible: false});
    this.props.onRss(url);
  }

  onAddClick(e) {
    this.props.onAdd();
  }

  onRssClick(e) {
    this.setState((prevState) => {return {promptVisible: !prevState.promptVisible}});
  }

  render() {
    return (
      <div className='somePadding'>
        <div style={{textAlign: 'center'}}>
          <button className='btn btn-info' onClick={this.onAddClick}>+</button>
          <button 
            style={{backgroundColor: this.props.rssColor}}
            className='someHorizontalPadding btn btn-info' 
            onClick={this.onRssClick}>RSS</button>
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
// [Props: tds - list of {title, description, id}, rssColor, onAdd, onRss, onDelete]
function App(props) {
  return (
    <div>
      <div id='myTitle'> 
        <div className='inlinedDiv'>
          <h1>Cluster</h1>
        </div>
        <div className='inlinedDiv'>
          <img id='myLogo' className='img-circle' src={tuxIconUrl}></img>
        </div>
        <div className='inlinedDiv'>
          <h1>Viz</h1>
        </div>
      </div>
      <TDAdder onAdd={props.onAdd} onRss={props.onRss} rssColor={props.rssColor}/>
      <TDList tds={props.tds} onDelete={props.onDelete} />
    </div>
  );
}

////////////////////////
// React-redux

function getRssState(state) {
  return state.rssState;
}

const getRssColor = createSelector(
  getRssState,
  (rssState) => {
    switch (rssState) {
      case RSS_NORMAL:
        return '';
      case RSS_WORKING:
        return 'green';
      case RSS_FAILED:
        return 'red';
      default:
        throw 'getRssColor invalid input';
    }
  } 
);

function makeMapStateToProps() {
  return (state) => {
    return {tds: state.tds, rssColor: getRssColor(state)};
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAdd: () => {
      dispatch(addTD({title: '', description: ''}));
    },
    onRss: (url) => {
      dispatch(requestRss(url));
    },
    onDelete: (id) => {
      dispatch(deleteTD(id));
    }
  };
}

const AppContainer = connect(makeMapStateToProps, mapDispatchToProps)(App);

////////////////////
// Run

let store = createStore(mainReducer, applyMiddleware(ReactThunk));

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
