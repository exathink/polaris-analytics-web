import { AvgCycleTime } from "../../../../shared/components/flowStatistics/flowStatistics";


export function CycleTimeCardView({
    data,
    dimension,
    displayType,
    cycleTimeTarget,
    instanceKey,
    flowAnalysisPeriod,
    trendAnalysisPeriod,
    specsOnly,
    latestCommit,
    latestWorkItemEvent,
    targetPercentile,
    includeSubTasks,
  }) {
    const {cycleMetricsTrends} = data[dimension];
    let [currentTrend, previousTrend] = cycleMetricsTrends;
    currentTrend = {...currentTrend, measurementWindow: flowAnalysisPeriod};
    return (
      <div className="tw-h-full tw-w-full">
        <AvgCycleTime
          displayType={displayType}
          displayProps={{
            className: "tw-p-2",
            info: {title: "title"},
            subTitle: <span>Last {flowAnalysisPeriod} Days</span>,
            trendsView: {
              title: "",
              content: (
                "Cycle Time Trends"
              ),
              placement: "bottom",
            },
            targetText: <span>Target {cycleTimeTarget} Days</span>
          }}
          specsOnly={specsOnly}
          target={cycleTimeTarget}
          currentMeasurement={currentTrend}
          previousMeasurement={previousTrend}
          measurementWindow={flowAnalysisPeriod}
        />
      </div>
    );
  }