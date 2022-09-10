import classNames from "classnames";
import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import { DimensionCycleTimeHistogramWidget } from "../closed/flowMetrics/dimensionCycleTimeHistogramWidget";
import { DimensionCycleTimeWidget } from "../closed/flowMetrics/dimensionCycleTimeWidget";

const dashboard_id = "dashboards.cycle.time.breakup";

let globalCount = 0;

export function DimensionCycleTimeDetailDashboard({
  dimension,
  dimensionData: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settingsWithDefaults},
  context,
  specsOnly
}) {

  // only when this counter is 1, we add grid-rows-[50%_50%] class, after this we remove it
  React.useEffect(() => {
    globalCount+=1;
  })

  const {
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    responseTimeConfidenceTarget,
    flowAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      className={classNames("tw-grid tw-gap-2 tw-h-[650px]", globalCount===1 ? "tw-grid-rows-[50%_50%]" : "")}
      gridLayout={true}
    >
      <DashboardRow>
        <DashboardWidget
          name="cycle-time-metrics"
          hideTitlesInDetailView={true}
          className="tw-h-full"
          render={({view}) => (
            <DimensionCycleTimeWidget
              dimension={dimension}
              instanceKey={key}
              view={view}
              initialSelection={""}
              twoRows={true}
              context={context}
              specsOnly={specsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              days={flowAnalysisPeriod}
              measurementWindow={flowAnalysisPeriod}
              samplingFrequency={flowAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          title={""}
          name="cycle-time-histogram-details"
          className="tw-h-full"
          render={({view}) => (
            <DimensionCycleTimeHistogramWidget
              dimension={dimension}
              instanceKey={key}
              specsOnly={specsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              days={flowAnalysisPeriod}
              initialDays={flowAnalysisPeriod}
              initialMetric={"cycleTime"}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}
