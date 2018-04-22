import React from 'react';
import {Chart} from 'react-jsx-highcharts';



export default ({containerWidth, containerHeight, onSelection, ...rest}) => {
  const selectionHandler = (e) => {
    onSelection(e);
  };
  return (
    <Chart
      height={containerHeight}
      width={containerWidth}
      onSelection={onSelection? selectionHandler : undefined}
      {...rest}
    />
  )}