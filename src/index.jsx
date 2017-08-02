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
  }

  onTitleChange(e) {
    this.setState({title: e.target.value});
  }

  onDescriptionChange(e) {
    this.setState({description: e.target.value});
  }

  render() {
    return (
      <div className='somePadding'>
        <div className='form-group'>
          <label>Title</label>
          <input className='form-control' value={this.state.title} onChange={this.onTitleChange}></input>
        </div>
        <div className='form-group'>
          <label>Description:</label>
          <textarea className='form-control' onChange={this.onDescriptionChange}>{this.state.description}</textarea>
        </div>
        <button className='btn btn-primary'>Delete</button>
      </div>
    );
  }
}

ReactDOM.render(
  <TitleDescription title='Job 1'>Bad job</TitleDescription>,
  document.getElementById('root')
);
