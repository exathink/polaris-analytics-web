import {CycleTimeCardView} from "../responseTimeSLA/cycleTimeCardView";
import {AgeCardView, ThroughputCardView, VolumeCardView} from "../throughput/throughputViews";

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
  const {displayType, metric, displayProps} = displayBag;
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
    volume: (
      <VolumeCardView
        data={data}
        dimension={dimension}
        displayType={displayType}
        displayProps={displayProps}
        flowAnalysisPeriod={flowAnalysisPeriod}
        specsOnly={specsOnly}
      />
    ),
    age: (
      <AgeCardView
        data={data}
        dimension={dimension}
        displayType={displayType}
        displayProps={displayProps}
        flowAnalysisPeriod={flowAnalysisPeriod}
        cycleTimeTarget={cycleTimeTarget}
        specsOnly={specsOnly}
      />
    ),
  };
  const metricViewElement = metricMap[metric];
  return <div className="tw-h-full tw-w-full">{metricViewElement}</div>;
}
