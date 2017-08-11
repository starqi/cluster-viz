import React from 'react';
import PropTypes from 'prop-types';

// A single deletable pair - title & description
class TitleDescription extends React.Component {
  static propTypes = {
    children: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    onDelete: PropTypes.func,
    onLoseFocus: PropTypes.func
  }

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
                onBlur={this.onBlur}/>
            </div>
            <div className='form-group'>
              <label>Description</label>
              <textarea 
                className='myTextArea form-control' 
                value={this.state.description} 
                onChange={this.onDescriptionChange}
                onBlur={this.onBlur}/>
            </div>
            <button className='btn btn-primary' onClick={this.onDeleteClick}>Delete</button>
          </form>
        </div>
      </div>
    );
  }
}

export default TitleDescription;
