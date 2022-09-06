import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import { DimensionCycleTimeWidget } from "../closed/flowMetrics/dimensionCycleTimeWidget";

const dashboard_id = "dashboards.cycle.time.breakup";

export function DimensionCycleTimeDetailDashboard({
  dimension,
  dimensionData: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settingsWithDefaults},
  context,
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

  const [workItemScope, setWorkItemScope] = useState("specs");
  const [yAxisScale, setYAxisScale] = React.useState("histogram");

  const limitToSpecsOnly = workItemScope === "specs";

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      gridLayout={true}
      className="tw-grid tw-grid-cols-[49.5%_49.5%] tw-grid-rows-[50%_47%] tw-gap-2 tw-h-[600px]"
    >
      <DashboardRow>
        <DashboardWidget
          name="flow-metrics"
          title={`Response Time`}
          subtitle={`${limitToSpecsOnly ? "Specs" : "All Cards"}, Last ${flowAnalysisPeriod} days`}
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
              specsOnly={limitToSpecsOnly}
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
            <DimensionDeliveryCycleFlowMetricsWidget
              dimension={dimension}
              instanceKey={key}
              specsOnly={limitToSpecsOnly}
              view={view}
              context={context}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              days={flowAnalysisPeriod}
              initialDays={flowAnalysisPeriod}
              initialMetric={"cycleTime"}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
              yAxisScale={yAxisScale}
              setYAxisScale={setYAxisScale}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}
