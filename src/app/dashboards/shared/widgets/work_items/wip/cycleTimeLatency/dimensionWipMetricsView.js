import {AvgAge, Wip} from "../../../../components/flowStatistics/flowStatistics";

export function DimensionWipMetricsView({data, dimension, displayBag, cycleTimeTarget, specsOnly}) {
  const {pipelineCycleMetrics} = data[dimension];
  const {displayType, metric, displayProps} = displayBag;

  // TODO: Need to calculate this from api response
  const wipLimit = 1.4;
  
  const metricMap = {
    total: (
      <Wip
        title={<span>Total</span>}
        currentMeasurement={pipelineCycleMetrics}
        specsOnly={specsOnly}
        target={wipLimit}
        displayType={displayType}
        displayProps={{className: "tw-p-2", targetText: <span>Limit {wipLimit}</span>, ...displayProps}}
      />
    ),
    avgAge: (
      <AvgAge
        currentMeasurement={pipelineCycleMetrics}
        target={cycleTimeTarget}
        displayType={displayType}
        displayProps={{className: "tw-p-2", targetText: <span>Target {cycleTimeTarget} Days</span>, ...displayProps}}
      />
    ),
  };

  // get the correct view component
  const metricViewElement = metricMap[metric];

  return <div className="tw-h-full tw-w-full">{metricViewElement}</div>;
}
