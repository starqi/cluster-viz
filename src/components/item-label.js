import React from 'react';
import PropTypes from 'prop-types';

const ItemLabel = ({title, x, y, x2, y2}) => (
  <g>
    <text className='svgLabel' x={x} y={y}>{title}</text>
    <line className='svgLine' x1={x} y1={y} x2={x2} y2={y2}/>
  </g>
);

ItemLabel.propTypes = {
  title: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  x2: PropTypes.number.isRequired,
  y2: PropTypes.number.isRequired
};

export default ItemLabel;
