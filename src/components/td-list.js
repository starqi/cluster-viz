import React from 'react';
import PropTypes from 'prop-types';
import TitleDescription from './title-description';

// A list of TitleDescriptions
const TdList = ({tds, onDelete, onTextLoseFocus}) => (
  <div className='somePadding'>
    {tds.map(a => 
      <TitleDescription 
        key={a.id} id={a.id}
        onDelete={onDelete}
        onLoseFocus={onTextLoseFocus}
        title={a.title}>{a.description}</TitleDescription>
    )}
  </div>
);

TdList.propTypes = {
  tds: PropTypes.array.isRequired,
  onDelete: PropTypes.func,
  onTextLoseFocus: PropTypes.func
};

export default TdList;
