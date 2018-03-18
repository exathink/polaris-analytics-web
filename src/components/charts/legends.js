import React from 'react';
import {Legend} from 'react-jsx-highcharts';

export const LegendRight = (props) => (
  <Legend align={'right'}
          layout={'vertical'}
          verticalAlign={'middle'}
          {...props}
  />
);