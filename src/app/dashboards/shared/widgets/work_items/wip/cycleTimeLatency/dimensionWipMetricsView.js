import { useIntl } from "react-intl";
import { i18nNumber } from "../../../../../../helpers/utility";
import {AvgAge, Wip} from "../../../../components/flowStatistics/flowStatistics";

export function DimensionWipMetricsView({data, flowMetricsData, dimension, displayBag, cycleTimeTarget, specsOnly, days}) {
  const intl = useIntl();
  const {pipelineCycleMetrics} = data[dimension];
  const {displayType, metric, displayProps} = displayBag;

  function getWipLimit() {
    const cycleMetricsTrend = flowMetricsData[dimension]["cycleMetricsTrends"][0]
    const flowItems = cycleMetricsTrend?.[specsOnly ? "workItemsWithCommits" : "workItemsInScope"]??0;
    const throughputRate = flowItems / days;
    return i18nNumber(intl, throughputRate * cycleTimeTarget, 0);
  }
  
  const wipLimit = getWipLimit();

  const metricMap = {
    volume: (
      <Wip
        title={<span>Work In Progress: Total</span>}
        currentMeasurement={pipelineCycleMetrics}
        specsOnly={specsOnly}
        target={wipLimit}
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          supportingMetric: <span>Limit {wipLimit}</span>,
          trendsView: {title: "Total", content: <span>Volume Trends</span>},
          info: {title: "Info", content: "content"},
          ...displayProps,
        }}
      />
    ),
    avgAge: (
      <AvgAge
        title={<span>Work In Progress: Age <sup>Avg</sup></span>}
        currentMeasurement={pipelineCycleMetrics}
        target={cycleTimeTarget}
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          supportingMetric: <span>Target {cycleTimeTarget} Days</span>,
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
