import React from 'react';
import PropTypes from 'prop-types';
//
import SimplePrompt from './simple-prompt';

// Buttons for adding a new box, importing an RSS feed, or submitting the data
class TdAdder extends React.Component {
  static propTypes = {
    onAdd: PropTypes.func,
    onRss: PropTypes.func,
    onSubmit: PropTypes.func,
    rssColor: PropTypes.string.isRequired,
    isSubmitDisabled: PropTypes.bool.isRequired
  }

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
          onClick={this.onPromptClick}/>
      </div>
    );
  }
}

export default TdAdder;
