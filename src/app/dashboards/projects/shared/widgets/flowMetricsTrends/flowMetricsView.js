import {CycleTimeCardView} from "../responseTimeSLA/cycleTimeCardView";
import {ThroughputDetailDashboard} from "../throughput/throughputDetailDashboard";
import {ThroughputCardView, VolumeCardView} from "../throughput/throughputViews";

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
  view,
}) {
  const {metric, displayType, displayProps} = displayBag;
  const metricMap = {
    throughput:
      view === "detail" ? (
        <ThroughputDetailDashboard
          dimension={dimension}
          instanceKey={instanceKey}
          flowAnalysisPeriod={flowAnalysisPeriod}
          trendAnalysisPeriod={trendAnalysisPeriod}
          latestCommit={latestCommit}
          latestWorkItemEvent={latestWorkItemEvent}
          targetPercentile={targetPercentile}
          specsOnly={specsOnly}
          includeSubTasks={includeSubTasks}
          displayBag={{classNameForFirstCard: "tw-w-full"}}
        />
      ) : (
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
  };
  const metricViewElement = metricMap[metric];
  return <div className="tw-h-full tw-w-full">{metricViewElement}</div>;
}
