import { AvgCycleTime } from "../../../../shared/components/flowStatistics/flowStatistics";
import { AppTerms } from "../../../../shared/config";
import { DimensionCycleTimeDetailDashboard } from "../../../../shared/widgets/work_items/responseTime/dimensionCycleTimeDetailDashboard";
import { ProjectDashboard } from "../../../projectDashboard";


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
                Cycle Time Details, {specsOnly? AppTerms.specs.display : AppTerms.cards.display}, <span className="tw-text-base tw-italic">Last {flowAnalysisPeriod} Days</span>
              </div>
            ),
            content: (
              <ProjectDashboard
                pollInterval={1000 * 60}
                render={({project, ...rest}) => (
                  <DimensionCycleTimeDetailDashboard dimension={"project"} dimensionData={project} specsOnly={specsOnly} {...rest} />
                )}
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