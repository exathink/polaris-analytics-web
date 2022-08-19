import React, { useState } from "react";
import { Dashboard, DashboardRow, DashboardWidget } from "../../../../framework/viz/dashboard";
import { FlowMetricsTrendsWidget } from "../../shared/widgets/flowMetricsTrends/flowMetricsTrendsWidget";
import { ProjectPipelineFunnelWidget } from "../../shared/widgets/funnel";
import {
  DimensionWipMetricsWidget
} from "../../../shared/widgets/work_items/wip/cycleTimeLatency/dimensionWipMetricsWidget";
import { DimensionPipelineQuadrantSummaryWidget } from "../../../shared/widgets/work_items/wip";
import { ProjectDashboard } from "../../projectDashboard";

const dashboard_id = "dashboards.activity.projects.newFlow.instance";

export function NewFlowDashboard({
                                   project: { key, latestWorkItemEvent, latestCommit, settings, settingsWithDefaults },
                                   context
                                 }) {
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

  const {
    responseTimeConfidenceTarget,
    flowAnalysisPeriod,
    trendsAnalysisPeriod,
    includeSubTasksFlowMetrics,
    includeSubTasksWipInspector,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    cycleTimeTarget,
    leadTimeTarget,
    latencyTarget,
    wipLimit
  } = settingsWithDefaults;

  return (
    <Dashboard
      dashboard={`${dashboard_id}`}
      className="tw-grid tw-grid-cols-5 tw-grid-rows-[22%_50%_6%_22%] tw-gap-2 tw-p-2"
      gridLayout={true}
    >
      <DashboardRow>
        <DashboardWidget
          name="throughput-summary-card"
          title=""
          classNameForDetailIcon="tw-absolute tw-top-1 tw-right-1 tw-cursor-pointer tw-opacity-100 tw-z-50"
          render={({ view }) => {
            return (
              <FlowMetricsTrendsWidget
                dimension="project"
                instanceKey={key}

                // Summary Card Data
                // Throughput for a single measurement period
                // There will always be 2 data points in this trend, the trend value compares the difference between the first and the second data point
                // days = measurementWindow = samplingFrequency
                // days is set to flowAnalysisPeriod by default
                days={flowAnalysisPeriod}
                measurementWindow={flowAnalysisPeriod}
                samplingFrequency={flowAnalysisPeriod}

                trendAnalysisPeriod={trendsAnalysisPeriod}
                flowAnalysisPeriod={flowAnalysisPeriod}
                targetPercentile={responseTimeConfidenceTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksFlowMetrics}
                view={view}
                displayBag={{ metric: "throughput", displayType: "cardAdvanced", iconsShiftLeft: false }}
              />
            );
          }}
          infoConfig={{title: "Throughput", headerContent: () => <span></span>, showDrawer: true, drawerContent: () => <span>Drawer Content</span>}}
        />

        <DashboardWidget
          name="cycletime-summary"
          title=""
          className="tw-col-start-5"
          render={({ view }) => {
            return (
              <FlowMetricsTrendsWidget
                dimension="project"
                instanceKey={key}

                days={flowAnalysisPeriod}
                measurementWindow={flowAnalysisPeriod}
                samplingFrequency={flowAnalysisPeriod}

                trendAnalysisPeriod={trendsAnalysisPeriod}
                flowAnalysisPeriod={flowAnalysisPeriod}
                targetPercentile={responseTimeConfidenceTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksFlowMetrics}
                cycleTimeTarget={cycleTimeTarget}
                displayBag={{ metric: "cycleTime", displayType: "cardAdvanced" }}
              />
            );
          }}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="pipeline-funnel-summary"
          className="tw-col-span-3 tw-col-start-2 tw-row-span-2 tw-row-start-1"
          render={({ view }) => (
            <ProjectPipelineFunnelWidget
              instanceKey={key}
              context={context}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={flowAnalysisPeriod}
              view={view}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              includeSubTasks={{
                includeSubTasksInClosedState: includeSubTasksFlowMetrics,
                includeSubTasksInNonClosedState: includeSubTasksWipInspector
              }}
              displayBag={{ funnelCenter: ["42%", "50%"] }}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow className="tw-col-span-5 tw-row-start-3 tw-justify-center tw-self-end" title="Work In Progress">
        <DashboardWidget
          name="wip-volume"
          title=""
          className="tw-row-start-4"
          render={({ view }) => {
            return (
              <DimensionWipMetricsWidget
                dimension="project"
                instanceKey={key}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeTarget={leadTimeTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksWipInspector}
                displayBag={{
                  metric: "volume",
                  displayType: "cardAdvanced"
                }}
                flowAnalysisPeriod={flowAnalysisPeriod}
              />
            );
          }}
          showDetail={false}
        />
        <DashboardWidget
          name="quadrant-summary-pipeline"
          className="tw-col-span-3 tw-col-start-2 tw-row-start-4"
          title={""}
          subtitle={""}
          render={({ view }) => (
            <DimensionPipelineQuadrantSummaryWidget
              dimension={"project"}
              instanceKey={key}
              display={"commonWipSummary"}
              days={flowAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTargetPercentile={leadTimeConfidenceTarget}
              cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              wipLimit={wipLimit}
              view={view}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              groupByState={true}
              includeSubTasks={includeSubTasksWipInspector}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />
        <DashboardWidget
          name="wip-age"
          title=""
          className="tw-col-start-5 tw-row-start-4"
          render={({ view }) => {
            return (
              <DimensionWipMetricsWidget
                dimension="project"
                instanceKey={key}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                cycleTimeTarget={cycleTimeTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksWipInspector}
                displayBag={{
                  metric: "avgAge",
                  displayType: "cardAdvanced"
                }}
              />
            );
          }}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}


const dashboard = ({ viewerContext }) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <NewFlowDashboard {...props} />} />
);

export default dashboard;