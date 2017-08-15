import React from 'react';
import PropTypes from 'prop-types';

class ClusterCount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: props.count};
  }

  onSelectChange = e => {
    this.setState({value: e.target.value});
    this.props.onChange(e.target.value);
  };

  render = () => (
    <select 
      className='form-control' 
      value={this.state.value}
      onChange={this.onSelectChange}
      style={{width: '30%', margin: 'auto'}}>
      {/*Array(5).map((a, i) => <option value={i}>{i}</option>)*/}
      <option value='1'>1 cluster</option>
      <option value='2'>2 clusters</option>
      <option value='3'>3 clusters</option>
      <option value='4'>4 clusters</option>
      <option value='5'>5 clusters</option>
    </select>
  );
}

ClusterCount.props = {
  onChange: PropTypes.func,
  count: PropTypes.number
};

export default ClusterCount;
