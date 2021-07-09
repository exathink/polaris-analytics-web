import './statistic.css';
import React from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
export {Statistic} from 'antd';

// Display the trend indicator only if abs value of the delta is greater than this threshold.
export const TrendIndicatorDisplayThreshold = 2;

export const TrendIndicator = ({firstValue, secondValue, good, deltaThreshold=TrendIndicatorDisplayThreshold}) => {
  if (firstValue && secondValue) {
    const delta = ((firstValue - secondValue) / (1.0 * firstValue)) * 100;
    return Math.abs(delta) > deltaThreshold &&
    <LegacyIcon
      type={delta > 0 ? 'arrow-up' : 'arrow-down'}
      style={good ? good(delta) ? {color: '#399a15'} : {color: '#9a3727'} : {color: '#c1c1c6'}}

    />;
  } else {
    return null;
  }
}

TrendIndicator.isPositive = (delta) => delta > 0;
TrendIndicator.isNegative = (delta) => delta < 0;

export const TrendIndicatorNew = ({
  firstValue,
  secondValue,
  good,
  deltaThreshold = TrendIndicatorDisplayThreshold,
  measurementWindow,
}) => {
  function getTrendIndicator(delta, good) {
    const absDelta = Math.abs(delta);
    const style = good(delta) ? "good" : "bad";
    const icon =
      delta > 0 ? (
        <span className={`${style}IndicatorArrow`}>
          <ArrowUpOutlined size="small" />
        </span>
      ) : (
        <span className={`${style}IndicatorArrow`}>
          <ArrowDownOutlined />
        </span>
      );

    return (
      // show indicator only if absDelta greater than the indicator display threshold
      absDelta > deltaThreshold && (
        <div>
          <div className={`${style}Indicator`}>
            {icon} <span>{absDelta.toFixed(2)}%</span>
          </div>
          <div>
            <span className={"comparisonWindow"}>Compared to prior {measurementWindow} days.</span>
          </div>
        </div>
      )
    );
  }

  if (good && firstValue && secondValue) {
    const delta = ((firstValue - secondValue) / (1.0 * firstValue)) * 100;

    return getTrendIndicator(delta, good);
  } else {
    return null;
  }
};

