import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

// A text prompt that disappears when submitted, initially invisible
class SimplePrompt extends React.Component {
  static propTypes = {
    visible: PropTypes.bool.isRequired,
    buttonLabel: PropTypes.string.isRequired,
    onClick: PropTypes.func
  }

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
              onChange={this.onChange}/>
          </div>
        </div>
      </div>
    );
  }
}

export default SimplePrompt;
