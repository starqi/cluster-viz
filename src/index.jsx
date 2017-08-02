// Libraries
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import Bootstrap from 'bootstrap/dist/css/bootstrap.css';

// App
import './style.css';
import tuxIconUrl from './tux.png';

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
      <div className='someVerticalPadding'> 
        <div className='form-group'>
          <label>Title</label>
          <input className='form-control' value={this.state.title} onChange={this.onTitleChange}></input>
        </div>
        <div className='form-group'>
          <label>Description</label>
          <textarea className='myTextArea form-control' value={this.state.description} onChange={this.onDescriptionChange}></textarea>
        </div>
        <button className='btn btn-primary' onClick={this.onDeleteClick}>Delete</button>
      </div>
    );
  }
}

class TDList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tdList: [],
      keyCounter: 0
    };
    this.onAddClick = this.onAddClick.bind(this);
    this.onDeleteSignal = this.onDeleteSignal.bind(this);
  }

  onAddClick(e) {
    this.setState(function (prevState, props) {
      const newKeyCounter = prevState.keyCounter + 1;
      prevState.tdList.push(
        <TitleDescription
          key={newKeyCounter} id={newKeyCounter}
          title='' onDeleteSignal={this.onDeleteSignal}></TitleDescription>
      );
      console.log(newKeyCounter);
      return {tdList: prevState.tdList, keyCounter: newKeyCounter};
    });
  }

  onDeleteSignal(i) {
    this.setState(function (prevState, props) {
      console.log(i);
      const index = prevState.tdList.findIndex((a) => a.props.id == i);
      console.log(index);
      prevState.tdList.splice(index, 1);
      return {tdList: prevState.tdList};
    });
  }

  render() {
    return (
      <div className='somePadding'>
        <button className='btn btn-info' onClick={this.onAddClick}>+</button>
        {this.state.tdList}
      </div>
    );
  }
}

ReactDOM.render(
  <TDList />,
  document.getElementById('root')
);
