import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';

// Bootstrap pop up for server wait, hence not closeable by user
class WaitingModal extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.string.isRequired,
    show: PropTypes.bool.isRequired
  }

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
    this.intervalId = setInterval(() => {
      dots = (dots + 1) % 4;
      this.setState({children: this.props.children + '.'.repeat(dots)});
    }, 300);
  }

  componentDidUpdate() {
    this.updateVisibility();
  }

  componentWillUnmount() {
    console.assert(this.intervalId !== undefined);
    clearInterval(this.intervalId);
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

export default WaitingModal;
