// Libraries
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery';

// App
import './index.css';
import tuxIconUrl from './tux.png';

// A single deletable set of textboxes
// Props: children, title, onDeleteSignal, id
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

// A modifiable list of TitleDescriptions
// Props: children
class TDList extends React.Component {
  constructor(props) {
    super(props);

    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteSignal = this.onDeleteSignal.bind(this);
    this.addTitleDescription = this.addTitleDescription.bind(this);
    this.onRSSClick = this.onRSSClick.bind(this);
    this.onPromptClick = this.onPromptClick.bind(this);

    this.state = {
      tdList: [],
      keyCounter: 0,
      promptVisible: false
    }

    // Import initial list of TitleDescriptions if any
    if (props.children !== undefined) {
      let children = props.children;
      if (!Array.isArray(children)) // If only one, it's not an array...
        children = [children];

      // Map initial list to actual state list
      this.state.tdList = children.map((a, i) => {
        return (
          <TitleDescription 
            key={i} id={i} title={a.props.title}
            onDeleteSignal={this.onDeleteSignal}>
            {a.props.children}
          </TitleDescription>
        );
      });

      // Assumes state counter increases first, then assigned
      this.state.keyCounter = children.length - 1; 
    }
  }

  onAddClick(e) {
    this.addTitleDescription('', '');
  }

  addTitleDescription(title, description) {
    this.setState((prevState) => {
      const newKeyCounter = prevState.keyCounter + 1; // Assign unique ID
      prevState.tdList.push(
        <TitleDescription
          key={newKeyCounter} id={newKeyCounter}
          title={title} onDeleteSignal={this.onDeleteSignal}>
          {description}
        </TitleDescription>
      );
      return {tdList: prevState.tdList, keyCounter: newKeyCounter};
    });
  }

  onRSSClick() {
    this.setState((prevState) => {return {promptVisible: !prevState.promptVisible}});
  }

  onPromptClick(url) {
    this.setState({promptVisible: false});
    alert(url);
  }

  // Sent by children for deletion request
  // i - ID of child
  onDeleteSignal(i) {
    this.setState((prevState) => {
      // Delete matching ID
      const index = prevState.tdList.findIndex((a) => a.props.id == i);
      prevState.tdList.splice(index, 1);
      return {tdList: prevState.tdList};
    });
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
        {this.state.tdList}
      </div>
    );
  }
}

// A text prompt that disappears when submitted, initially invisible
// Props: visible, buttonLabel, onClick
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

ReactDOM.render(
  <div>
    <div id='myTitle'> 
      <div className='inlinedDiv'>
        <img id='myLogo' className='img-circle' src={tuxIconUrl}></img>
      </div>
      <div className='inlinedDiv'>
        <h1>InterestSummarizer</h1>
      </div>
    </div>
    <TDList>
      <TitleDescription title='Web development'>Frontend, backend, databases, React, Redux.</TitleDescription>
    </TDList>
  </div>,
  document.getElementById('root')
);
