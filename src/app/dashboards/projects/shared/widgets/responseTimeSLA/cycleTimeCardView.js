import { AvgCycleTime } from "../../../../shared/components/flowStatistics/flowStatistics";
import { AppTerms } from "../../../../shared/config";
import {
  DimensionCycleTimeDetailDashboard
} from "../../../../shared/widgets/work_items/responseTime/dimensionCycleTimeDetailDashboard";
import { NavigationLink } from "../../../../../helpers/components";

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
                <div className="tw-flex tw-items-baseline tw-justify-between">
                  <div className="tw-text-lg tw-text-gray-300 ">
                    Cycle Time Details, {specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`},{" "}
                    <span className="tw-text-base tw-italic">Last {flowAnalysisPeriod} Days</span>
                  </div>

                  <NavigationLink to="responseTime" />
                </div>
              ),
              content: (
                <DimensionCycleTimeDetailDashboard
                  dimension={dimension}
                  dimensionData={{
                    key: instanceKey,
                    latestWorkItemEvent,
                    latestCommit,
                    settingsWithDefaults: {flowAnalysisPeriod, trendAnalysisPeriod, cycleTimeTarget},
                  }}
                  specsOnly={specsOnly}
                />
              ),
              placement: "top",
            },
            trendsView: {
              title: "",
              content: (
                <AvgCycleTime
                  title={<span>Volume</span>}
                  displayType={"trendsCompareCard"}
                  displayProps={{measurementWindow: flowAnalysisPeriod}}
                  currentMeasurement={currentTrend}
                  previousMeasurement={previousTrend}
                />
              ),
              placement: "top",
            },
            supportingMetric: <span>Limit {cycleTimeTarget} Days</span>,
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