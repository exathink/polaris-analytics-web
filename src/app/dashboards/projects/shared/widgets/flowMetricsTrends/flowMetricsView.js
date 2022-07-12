import {CycleTimeCardView} from "../responseTimeSLA/cycleTimeCardView";
import {ThroughputCardView} from "../throughput/throughputViews";

export function FlowMetricsView({
  data,
  dimension,
  instanceKey,
  displayBag,
  flowAnalysisPeriod,
  trendAnalysisPeriod,
  targetPercentile,
  cycleTimeTarget,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
  includeSubTasks,
}) {
  const {metric, displayType, displayProps} = displayBag;
  const metricMap = {
    throughput: (
      <ThroughputCardView
        data={data}
        dimension={dimension}
        instanceKey={instanceKey}
        displayType={displayType}
        flowAnalysisPeriod={flowAnalysisPeriod}
        trendAnalysisPeriod={trendAnalysisPeriod}
        specsOnly={specsOnly}
        latestCommit={latestCommit}
        latestWorkItemEvent={latestWorkItemEvent}
        includeSubTasks={includeSubTasks}
        targetPercentile={targetPercentile}
      />
    ),
    cycleTime: (
      <CycleTimeCardView
        data={data}
        dimension={dimension}
        instanceKey={instanceKey}
        displayType={displayType}
        flowAnalysisPeriod={flowAnalysisPeriod}
        trendAnalysisPeriod={trendAnalysisPeriod}
        specsOnly={specsOnly}
        latestCommit={latestCommit}
        latestWorkItemEvent={latestWorkItemEvent}
        includeSubTasks={includeSubTasks}
        targetPercentile={targetPercentile}
        cycleTimeTarget={cycleTimeTarget}
      />
    ),
  };
  const metricViewElement = metricMap[metric];
  return <div className="tw-h-full tw-w-full">{metricViewElement}</div>;
}
