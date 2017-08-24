import React from 'react';
import PropTypes from 'prop-types';

const ClusterLabel = ({title, x, y}) => (
  <g>
    <text 
      style={{transform: `translate(-${title.length * 2}px,-20px)`}} 
      className="svgCluster" x={x} y={y}>{title}</text>
  </g>
);

ClusterLabel.propTypes = {
  title: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired
};

export default ClusterLabel;
