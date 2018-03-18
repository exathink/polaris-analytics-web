import React from 'react';
import {Chart} from 'react-jsx-highcharts';

export default ({containerWidth, containerHeight, ...rest}) => (
  <Chart height={containerHeight} width={containerWidth} {...rest}/>
)