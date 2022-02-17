import "./statistic.css";
import React from "react";
import {Icon as LegacyIcon} from "@ant-design/compatible";
import {ArrowDownOutlined, ArrowUpOutlined} from "@ant-design/icons";
import {Tooltip} from "antd";
import {TOOLTIP_COLOR} from "../../../helpers/utility";
export {Statistic} from "antd";

function getDelta(firstValue, secondValue) {
  return ((firstValue - secondValue) / (1.0 * firstValue)) * 100;
}

export function getTrendIndicatorUtils({firstValue, secondValue, good}) {
  const delta = getDelta(firstValue, secondValue);
  const style = good ? (good(delta) ? "good" : "bad") : "neutral";
  const trendIndicatorIcon =
    delta > 0 ? (
      <span className={`${style}IndicatorArrow`}>
        <ArrowUpOutlined size="small" />
      </span>
    ) : (
      <span className={`${style}IndicatorArrow`}>
        <ArrowDownOutlined size={"small"} />
      </span>
    );

  const absDelta = Math.abs(delta);
  const trendValue = <span className={`${style}IndicatorArrow`}>{absDelta.toFixed(2)}%</span>;
  return {trendIndicatorIcon, trendValue, delta, absDelta};
}

// Display the trend indicator only if abs value of the delta is greater than this threshold.
export const TrendIndicatorDisplayThreshold = 2;

export const TrendIndicator = ({firstValue, secondValue, good, deltaThreshold = TrendIndicatorDisplayThreshold}) => {
  if (firstValue && secondValue) {
    const delta = getDelta(firstValue, secondValue);
    return (
      Math.abs(delta) > deltaThreshold && (
        <LegacyIcon
          type={delta > 0 ? "arrow-up" : "arrow-down"}
          style={good ? (good(delta) ? {color: "#399a15"} : {color: "#9a3727"}) : {color: "#c1c1c6"}}
        />
      )
    );
  } else {
    return null;
  }
};

TrendIndicator.isPositive = (delta) => delta > 0;
TrendIndicator.isNegative = (delta) => delta < 0;

export const TrendIndicatorNew = ({
  firstValue,
  secondValue,
  good,
  deltaThreshold = TrendIndicatorDisplayThreshold,
  samplingFrequency,
}) => {
  if (firstValue && secondValue) {
    const {trendIndicatorIcon, trendValue, absDelta} = getTrendIndicatorUtils({firstValue, secondValue, good});

    return (
      // show indicator only if absDelta greater than the indicator display threshold
      absDelta > deltaThreshold && (
        <div>
          <div>
            {trendIndicatorIcon} {trendValue}
          </div>
          <div>
            <span className={"comparisonWindow"}>Compared to prior {samplingFrequency} days.</span>
          </div>
        </div>
      )
    );
  } else {
    return null;
  }
};

export function TrendWithTooltip({
  firstValue,
  secondValue,
  good,
  deltaThreshold = TrendIndicatorDisplayThreshold,
  samplingFrequency,
}) {
  if (firstValue && secondValue) {
    const {trendIndicatorIcon, trendValue, absDelta} = getTrendIndicatorUtils({firstValue, secondValue, good});

    return (
      absDelta > deltaThreshold && (
        <Tooltip
          title={
            <div>
              <div>
                {trendIndicatorIcon} {trendValue}
              </div>
              <div>
                <span className={"textXs"}>Compared to prior {samplingFrequency} days.</span>
              </div>
            </div>
          }
          color={TOOLTIP_COLOR}
        >
          <div className={`trendCursor`}>{trendIndicatorIcon}</div>
        </Tooltip>
      )
    );
  }
  return null;
}
