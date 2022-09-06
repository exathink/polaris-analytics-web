import { AvgCycleTime } from "../../../../shared/components/flowStatistics/flowStatistics";


export function CycleTimeCardView({
    data,
    dimension,
    displayType,
    displayProps,
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
            detailsView: {
              title: (
                <div className="tw-text-lg tw-text-gray-300">
                  Cycle Time Details <span className="tw-text-base tw-italic">Last {flowAnalysisPeriod} Days</span>
                </div>
              ),
              content: <div></div>,
              placement: "top",
            },
            trendsView: {
              title: "",
              content: "Cycle Time Trends",
              placement: "bottom",
            },
            supportingMetric: <span>Target {cycleTimeTarget} Days</span>,
            ...displayProps,
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