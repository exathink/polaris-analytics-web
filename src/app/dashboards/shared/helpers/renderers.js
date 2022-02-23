import {TrendMetric, TrendWithTooltip} from "../../../components/misc/statistic/statistic";

export function renderTrendMetric({metric, good, uom="days", samplingFrequency}) {
  return (text, record) => {
    const [current, previous] = record.cycleMetricsTrends ?? [];
    const props = {
      firstValue: current?.[metric],
      secondValue: previous?.[metric],
      good: good,
      samplingFrequency: samplingFrequency,
    };
    return text === "N/A" ? (
      <span className="textXs">N/A</span>
    ) : (
      <TrendMetric metricValue={text} uom={uom} trendIndicator={<TrendWithTooltip {...props}/>} />
    );
  };
}

export function renderMetric(text) {
  return text === "N/A" ? <span className="textSm">N/A</span> : <span className="textSm">{text}</span>;
}