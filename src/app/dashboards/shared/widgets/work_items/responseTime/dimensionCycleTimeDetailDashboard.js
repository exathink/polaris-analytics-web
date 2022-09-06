import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import { DimensionCycleTimeHistogramWidget } from "../closed/flowMetrics/dimensionCycleTimeHistogramWidget";
import { DimensionCycleTimeWidget } from "../closed/flowMetrics/dimensionCycleTimeWidget";

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

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      gridLayout={true}
      className="tw-grid tw-grid-cols-[49.5%_49.5%] tw-grid-rows-[50%_47%] tw-gap-2 tw-h-[650px]"
    >
      <DashboardRow>
        <DashboardWidget
          name="flow-metrics"
          title={`Response Time`}
          subtitle={`${specsOnly ? "Specs" : "All Cards"}, Last ${flowAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          className="tw-col-span-2"
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
          name="flow-metrics-delivery-details"
          className="tw-col-span-2"
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
