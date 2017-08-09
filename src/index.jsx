import 'bootstrap/dist/css/bootstrap.min.css';
import * as Bootstrap from 'bootstrap/dist/js/bootstrap.min.js';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
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

function addTd(td) {
  return {type: 'ADD_TD', td};
}

function updateTd(td) {
  return {type: 'UPDATE_TD', td};
}

function deleteTd(id) {
  return {type: 'DELETE_TD', id};
}

function beginRss() {
  return {type: 'BEGIN_RSS'};
}

function endRss() {
  return {type: 'END_RSS'};
}

function beginErrorRss() {
  return {type: 'ERROR_RSS'};
}

function flashErrorRss() {
  return (dispatch, getState) => {
    dispatch(beginErrorRss());
    setTimeout(() => {
      dispatch(endRss());
    }, 500);
  };
}

function requestRss(url) {
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

function beginSubmit() {
  return {type: 'BEGIN_SUBMIT'};
}

function endSubmit() {
  return {type: 'END_SUBMIT'};
}

const PAD_TIME = 3000; // lol
function submit() {
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
        alert('')
        dispatch(endSubmit());
      }).fail(() => {
        console.log('Cluster failed');
        alert('')
        dispatch(endSubmit());
      });
    }, PAD_TIME);
  };
}

// <Reducers>

const RSS_NORMAL = Symbol(), RSS_WORKING = Symbol(), RSS_FAILED = Symbol();

const defaultState = {
  tds: [],
  idCounter: 0,
  rssState: RSS_NORMAL,
  isSubmitting: false
};

function mainReducer(state = defaultState, action) {
  switch (action.type) {
    case 'ADD_TD':
      const tdWithID = Object.assign({}, action.td, {id: state.idCounter});
      return Object.assign({}, state, {
        tds: [...state.tds, tdWithID],
        idCounter: state.idCounter + 1
      });
    case 'UPDATE_TD':
      return Object.assign({}, state, {
        tds: state.tds.map(a => a.id === action.td.id ? action.td : a)
      });
    case 'DELETE_TD':
      return Object.assign({}, state, {
        tds: state.tds.filter(a => a.id !== action.id)
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
    case 'BEGIN_SUBMIT':
      return Object.assign({}, state, {
        isSubmitting: true
      });
    case 'END_SUBMIT':
      return Object.assign({}, state, {
        isSubmitting: false
      });
    default:
      return state;
  }
}

//////////////////////
// React views

// A single deletable pair - title & description
// [Props: children - the description, title, id, onDelete, onLoseFocus]
class TitleDescription extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: props.title,
      description: props.children
    };
  }

  onDeleteClick = e => {
    this.props.onDelete(this.props.id);
  }

  onTitleChange = e => {
    this.setState({title: e.target.value});
  }

  onDescriptionChange = e => {
    this.setState({description: e.target.value});
  }

  onBlur = e => {
    // Send update notifications on focus loss instead of text change
    this.props.onLoseFocus(Object.assign({}, this.state, {id: this.props.id}));
  }

  render() {
    return (
      <div className='panel panel-default someVerticalPadding'>
        <div className='panel-body'>
          <form className='formNoBottom'>
            <div className='form-group'> 
              <label>Title</label>
              <input 
                className='form-control' 
                value={this.state.title} 
                onChange={this.onTitleChange}
                onBlur={this.onBlur} />
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea 
                className='myTextArea form-control' 
                value={this.state.description} 
                onChange={this.onDescriptionChange}
                onBlur={this.onBlur} />
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
  }

  onChange = e => {
    this.setState({value: e.target.value});
  }

  onKeyDown = e => {
    if (e.keyCode === 13) {
      this.tryFinishPrompt();
    }
  }

  onClick = e => {
    this.tryFinishPrompt();
  }

  tryFinishPrompt = () => {
    if (this.state.value.trim() == '') return;
    this.props.onClick(this.state.value);
    this.setState({value: ''});
  }

  componentDidUpdate() {
    // Focus the prompt when it "pops up"
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
              ref={a => this.domRef = a}
              style={{width: '100%'}}
              className='form-control' 
              value={this.state.value} 
              onKeyDown={this.onKeyDown}
              onChange={this.onChange} />
          </div>
        </div>
      </div>
    );
  }
}

// Buttons for adding a new box, importing an RSS feed, or submitting the data
// [Props: onAdd, onRss, onSubmit; rssColor, isSubmitDisabled]
class TdAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      promptVisible: false
    };
  }

  onPromptClick = url => {
    this.setState({promptVisible: false});
    this.props.onRss(url);
  }

  onRssClick = e => {
    this.setState(prevState => {return {promptVisible: !prevState.promptVisible}});
  }

  onAddClick = e => {
    this.props.onAdd();
  }

  onSubmitClick = e => {
    this.props.onSubmit();
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
          <button 
            disabled={this.props.isSubmitDisabled}
            className='someHorizontalPadding btn btn-info' 
            onClick={this.onSubmitClick}>Submit</button>
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
// [Props: tds - list of {title, description, id}, onDelete, onTextLoseFocus]
function TdList(props) {
  return (
    <div className='somePadding'>
      {props.tds.map(a => 
        <TitleDescription 
          key={a.id} id={a.id}
          onDelete={props.onDelete}
          onLoseFocus={props.onTextLoseFocus}
          title={a.title}>{a.description}</TitleDescription>
      )}
    </div>
  );
}

// Bootstrap pop up for server wait, hence not closeable by user
// [Props: title, children - a string, show]
class WaitingModal extends React.Component {
  constructor(props) {
    super(props);
    console.assert(typeof props.children === 'string');
    this.state = {
      children: props.children
    };
  }

  updateVisibility() {
    $(this.domRef).modal(this.props.show ? 'show' : 'hide');
  }

  componentDidMount() {
    this.updateVisibility();

    // Permanent '...' animation
    let dots = 0;
    setInterval(() => {
      dots = (dots + 1) % 4;
      this.setState({children: this.props.children + '.'.repeat(dots)});
    }, 300);
  }

  componentDidUpdate() {
    this.updateVisibility();
  }

  render() {
    return (
      <div 
        className='modal fade' 
        tabIndex='-1' role='dialog' 
        data-backdrop='static'
        data-keyboard='false'
        ref={a => this.domRef = a}>
        <div className='modal-dialog' role='document'>
          <div className='modal-content'>
            <div style={{backgroundColor: '#5bc0de'}} className='modal-header'>
              <h4 className='modal-title'><b>{this.props.title}</b></h4>
            </div>
            <div className='modal-body'>
              {this.state.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

// The main app
// [Props: tds - list of {title, description, id}, 
//  rssColor, isSubmitDisabled, isSubmitting; onAdd, onRss, onDelete, onSubmit, onTextLoseFocus]
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
      <TdAdder 
        onAdd={props.onAdd}
        onRss={props.onRss} 
        onSubmit={props.onSubmit}
        rssColor={props.rssColor}
        isSubmitDisabled={props.isSubmitDisabled} />
      <TdList 
        tds={props.tds} 
        onDelete={props.onDelete} 
        onTextLoseFocus={props.onTextLoseFocus} />
      <WaitingModal title='' show={props.isSubmitting}>
        Processing
      </WaitingModal>
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
  rssState => {
    switch (rssState) {
      case RSS_NORMAL:
        return '';
      case RSS_WORKING:
        return 'black';
      case RSS_FAILED:
        return 'red';
      default:
        throw 'getRssColor invalid input';
    }
  } 
);

function makeMapStateToProps() {
  return state => {
    return {
      tds: state.tds,
      rssColor: getRssColor(state),
      isSubmitDisabled: state.tds.length === 0,
      isSubmitting: state.isSubmitting
    };
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onAdd: () => {
      dispatch(addTd({title: '', description: ''}));
    },
    onRss: url => {
      dispatch(requestRss(url));
    },
    onDelete: id => {
      dispatch(deleteTd(id));
    },
    onSubmit: id => {
      dispatch(submit());
    },
    onTextLoseFocus: td => {
      dispatch(updateTd(td));
    } 
  };
}

const AppContainer = connect(makeMapStateToProps, mapDispatchToProps)(App);

////////////////////
// Run

let store = createStore(mainReducer, applyMiddleware(ReactThunk));

// Create div that holds main component
const root = document.createElement('div');
root.id = 'root';
document.body.appendChild(root);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
