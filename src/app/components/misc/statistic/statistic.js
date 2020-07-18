import './statistic.css';
import React from 'react';
import {Icon} from 'antd'
export {Statistic, Icon} from 'antd';

// Display the trend indicator only if abs value of the delta is greater than this threshold.
export const TrendIndicatorDisplayThreshold = 1.0;

export const TrendIndicator = ({firstValue, secondValue, good, deltaThreshold=TrendIndicatorDisplayThreshold}) => {
  const delta = (firstValue - secondValue)/(1.0*firstValue);
  return (
      Math.abs(delta ) > deltaThreshold &&
        <Icon
          type={delta > 0 ?  'arrow-up' : 'arrow-down'}
          style={good(delta)? {color: '#399a15'} : {color: '#9a3727'}}

        />
  )
}

TrendIndicator.isPositive = (delta) => delta > 0;
TrendIndicator.isNegative = (delta) => delta <= 0;