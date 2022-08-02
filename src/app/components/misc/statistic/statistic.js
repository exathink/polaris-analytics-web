import "./statistic.css";
import React from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { i18nNumber, TOOLTIP_COLOR } from "../../../helpers/utility";
import { TrendColors } from "../../../dashboards/shared/config";
import { useIntl } from "react-intl";

export {Statistic} from "antd";

function getDelta(firstValue, secondValue) {
  return ((firstValue - secondValue) / (1.0 * firstValue)) * 100;
}

export function getTrendIndicatorUtils({firstValue, secondValue, good, intl}) {
  const delta = getDelta(firstValue, secondValue);
  const style = good ? (good(delta) ? "good" : "bad") : "neutral";
  const trendIndicatorIcon =
    delta > 0 ? (
      <span className={`${style}IndicatorArrow`} data-testid="trend-uparrow">
        <ArrowUpOutlined size="small" />
      </span>
    ) : (
      <span className={`${style}IndicatorArrow`} data-testid="trend-downarrow">
        <ArrowDownOutlined size={"small"} />
      </span>
    );

  const absDelta = Math.abs(delta);
  const trendValue = <span className={`${style}Indicator`} data-testid="trend-percent-val">{i18nNumber(intl, absDelta, 1)}%</span>;
  return {trendIndicatorIcon, trendValue, delta, absDelta};
}

// Display the trend indicator only if abs value of the delta is greater than this threshold.
export const TrendIndicatorDisplayThreshold = 2;

export const TrendIndicator = ({firstValue, secondValue, good, deltaThreshold = TrendIndicatorDisplayThreshold}) => {
  const intl = useIntl();
  if (firstValue && secondValue) {
    const {trendIndicatorIcon, absDelta} = getTrendIndicatorUtils({firstValue, secondValue, good, intl});
    return absDelta > deltaThreshold && trendIndicatorIcon;
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
  const intl = useIntl();
  if (firstValue && secondValue) {
    const {trendIndicatorIcon, trendValue, absDelta} = getTrendIndicatorUtils({firstValue, secondValue, good, intl});

    return (
      // show indicator only if absDelta greater than the indicator display threshold
      absDelta > deltaThreshold && (
        <div>
          <div className="trendIndicatorPadding">
            {trendIndicatorIcon} {trendValue}
          </div>
          <div>
            {samplingFrequency && <span className="comparisonWindow">Compared to prior {samplingFrequency} days.</span>}
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
  const intl = useIntl();
  if (firstValue && secondValue) {
    const {trendIndicatorIcon, trendValue, absDelta} = getTrendIndicatorUtils({firstValue, secondValue, good, intl});

    return (
      absDelta > deltaThreshold && (
        <Tooltip
          title={
            <div>
              <div>
                {trendIndicatorIcon} {trendValue}
              </div>
              <div>
                <span className={"tw-textXs"}>Compared to prior {samplingFrequency} days.</span>
              </div>
            </div>
          }
          color={TOOLTIP_COLOR}
        >
          <div className={`trendIcon`}>{trendIndicatorIcon}</div>
        </Tooltip>
      )
    );
  }
  return null;
}

export function getMetricUtils({target, value, uom, good, valueRender, precision}) {
  let color = "";
  if (target != null && value != null && good) {
    color = !good(value - target) ? TrendColors.bad : TrendColors.good;
  }

  const suffix = value ? uom : "";
  const renderedValue = valueRender(value);
  const metricValue = renderedValue
    ? renderedValue.toFixed
      ? renderedValue.toFixed(precision || 0)
      : renderedValue
    : "N/A";
  return {
    metricValue: (
      <span style={{color: color}} data-testid="metricValue">
        {metricValue}
      </span>
    ),
    suffix: (
      <span style={{color: color}} data-testid="uom">
        {suffix}
      </span>
    ),
    value: metricValue
  };
}

export function CustomStatistic({title, trendIndicator, value, suffix}) {
  return (
    <div>
      <div className="statisticTitle" data-testid="metricTitle">
        {title}
      </div>
      <TrendMetric metricValue={value} uom={suffix} trendIndicator={trendIndicator} />
    </div>
  );
}

export function TrendMetric({metricValue, uom, trendIndicator}) {
  return (
    <div className="trendMetricWrapper">
      <div className="trendMetricInnerWrapper">
        <div className={metricValue?.props?.children === "N/A" ? "tw-textSm" : "tw-textXl"}>{metricValue}</div>
        <div className="tw-textSm">{uom}</div>
      </div>{" "}
      {trendIndicator}
    </div>
  );
}

export function renderMetric(text) {
  return text === "N/A" ? <span className="tw-textSm">N/A</span> : <span className="tw-textXl">{text}</span>;
}