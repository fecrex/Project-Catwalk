import React from 'react';

function Thumbnail(props) {
  return (
    <div className='thumbnail'>
      <img className={props.imageSelected === props.pic ? 'selected-thumbnail' : 'normal-thumbnail'}
      src={props.pic} onClick={props.setSelected} alt={props.name}
      />
    </div>
  );
};

export default Thumbnail;