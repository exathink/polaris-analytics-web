import {TrendWithTooltip} from "../../../components/misc/statistic/statistic";

export function renderTrendMetric({metric, good, uom="days"}) {
  return (text, record) => {
    const [current, previous] = record.cycleMetricsTrends ?? [];
    const props = {
      firstValue: current?.[metric],
      secondValue: previous?.[metric],
      good: good,
      measurementWindow: 30,
    };
    return text === "N/A" ? (
      <span className="textXs">N/A</span>
    ) : (
      <div style={{display: "flex"}}>
        <div className="textXs">{text} {uom}</div> <TrendWithTooltip {...props} />
      </div>
    );
  };
}
