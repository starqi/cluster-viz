import React from 'react';
import PropTypes from 'prop-types';
import ItemLabel from './item-label';
import ClusterLabel from './cluster-label';

const HORIZONTAL_START = 200;
const VERTICAL_START = HORIZONTAL_START;
const VERTICAL_SKIP = HORIZONTAL_START * 2 + 25;
const MAX_DIST = HORIZONTAL_START - 25;

// Converts clusters into SVG
function toComponents(clusters) {
  return clusters.map((cluster, i) => (
    <ClusterLabel 
      key={i} title={cluster.title} 
      x={HORIZONTAL_START} y={i * VERTICAL_SKIP + VERTICAL_START}/>
  ));
}

// Converts cluster items into SVG
function toItems(clusters) {
  const itemArrays = clusters.map((cluster, i) => {
    let angleSkip = 2 * 3.14159 / cluster.items.length;
    return cluster.items.map((item, j) => (
      <ItemLabel 
        key={i + '-' + j} title={item.title} 
        x={MAX_DIST * item.distance * Math.cos(j * angleSkip) + HORIZONTAL_START} 
        y={MAX_DIST * item.distance * Math.sin(j * angleSkip) + i * VERTICAL_SKIP + VERTICAL_START}
        x2={HORIZONTAL_START} y2={i * VERTICAL_SKIP + VERTICAL_START}/>
    ));
  });
  const itemComponents = itemArrays.reduce((acc, item) => acc.concat(item), []); 
  return itemComponents;
}

// The cluster screen after sending RSS feed to server
const Clusters = (data) => (
  <div>
    <button 
      style={{margin: '5px'}} className='btn btn-info'
      onClick={e => window.location.replace('/#/')}>Back</button>
    <svg 
      className='svgContainer'
      width="100%" height={data.clusters.length * VERTICAL_SKIP}>
      {toComponents(data.clusters)}
      {toItems(data.clusters)}
    </svg>
  </div>
);

Clusters.propTypes = {
  clusters: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      distance: PropTypes.number
    }))
  })).isRequired
};

export default Clusters;
