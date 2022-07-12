import {AvgAge, Wip} from "../../../../components/flowStatistics/flowStatistics";

export function DimensionWipMetricsView({data, dimension, displayBag, cycleTimeTarget, specsOnly}) {
  const {pipelineCycleMetrics} = data[dimension];
  const {displayType, metric, displayProps} = displayBag;

  // TODO: Need to calculate this from api response
  const wipLimit = 1.4;

  const metricMap = {
    volume: (
      <Wip
        title={<span>Total</span>}
        currentMeasurement={pipelineCycleMetrics}
        specsOnly={specsOnly}
        target={wipLimit}
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          targetText: <span>Limit {wipLimit}</span>,
          trendsView: {title: "Total", content: <span>Volume Trends</span>},
          info: {title: "Info", content: "content"},
          ...displayProps,
        }}
      />
    ),
    avgAge: (
      <AvgAge
        currentMeasurement={pipelineCycleMetrics}
        target={cycleTimeTarget}
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          targetText: <span>Target {cycleTimeTarget} Days</span>,
          trendsView: {title: "Age", content: <span>Trends</span>},
          info: {title: "Info", content: "content"},
          ...displayProps,
        }}
      />
    ),
  };

  // get the correct view component
  const metricViewElement = metricMap[metric];

  return <div className="tw-h-full tw-w-full">{metricViewElement}</div>;
}
