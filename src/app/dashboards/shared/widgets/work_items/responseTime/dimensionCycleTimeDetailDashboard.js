import classNames from "classnames";
import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import { DimensionCycleTimeHistogramWidget } from "../closed/flowMetrics/dimensionCycleTimeHistogramWidget";
import { DimensionCycleTimeWidget } from "../closed/flowMetrics/dimensionCycleTimeWidget";
import { useQueryParamState } from "../../../../projects/shared/helper/hooks";

const dashboard_id = "dashboards.cycle.time.breakup";



export function DimensionCycleTimeDetailDashboard({
  dimension,
  dimensionData: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settingsWithDefaults},
  context,
  specsOnly
}) {

  const {
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    responseTimeConfidenceTarget,
    flowAnalysisPeriod,
    includeSubTasksFlowMetrics,
  } = settingsWithDefaults;

  const {state} = useQueryParamState();
  const workItemSelectors = state?.vs?.workItemSelectors??[];

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      className={classNames("tw-grid tw-gap-2 tw-h-[650px] tw-w-[700px] tw-grid-rows-2")}
      gridLayout={true}
    >
      <DashboardRow>
        <DashboardWidget
          name="cycle-time-metrics"
          hideTitlesInDetailView={true}
          render={({view}) => (
            <DimensionCycleTimeWidget
              dimension={dimension}
              instanceKey={key}
              tags={workItemSelectors}
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
          render={({view}) => (
            <DimensionCycleTimeHistogramWidget
              dimension={dimension}
              instanceKey={key}
              tags={workItemSelectors}
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
