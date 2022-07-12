import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {ProjectDashboard} from "../projectDashboard";
import {FlowMetricsTrendsWidget} from "../shared/widgets/flowMetricsTrends/flowMetricsTrendsWidget";
import {ProjectPipelineFunnelWidget} from "../shared/widgets/funnel";
import {DimensionWipMetricsWidget} from "../../shared/widgets/work_items/wip/cycleTimeLatency/dimensionWipMetricsWidget";
import { DimensionPipelineQuadrantSummaryWidget } from "../../shared/widgets/work_items/wip";

const dashboard_id = "dashboards.activity.projects.newFlow.instance";

function NewFlowDashboard({
  project: {key, latestWorkItemEvent, latestCommit, settings, settingsWithDefaults},
  context,
}) {
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

  const {
    responseTimeConfidenceTarget,
    flowAnalysisPeriod,
    trendAnalysisPeriod,
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
      className="tw-grid tw-grid-cols-5 tw-grid-rows-[20%_59%_20%] tw-gap-2 tw-p-2"
      gridLayout={true}
    >
      <DashboardRow>
        <DashboardWidget
          name="throughput-summary-card"
          title=""
          className=""
          render={({view}) => {
            return (
              <FlowMetricsTrendsWidget
                dimension="project"
                instanceKey={key}
                displayBag={{displayType: "cardAdvanced", metric: "throughput"}}
                flowAnalysisPeriod={flowAnalysisPeriod}
                trendAnalysisPeriod={trendAnalysisPeriod}
                targetPercentile={responseTimeConfidenceTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksFlowMetrics}
              />
            );
          }}
          showDetail={false}
        />

        <DashboardWidget
          name="cycletime-summary"
          title=""
          className="tw-col-start-5"
          render={({view}) => {
            return (
              <FlowMetricsTrendsWidget
                dimension="project"
                instanceKey={key}
                displayBag={{displayType: "cardAdvanced", metric: "cycleTime"}}
                flowAnalysisPeriod={flowAnalysisPeriod}
                trendAnalysisPeriod={trendAnalysisPeriod}
                targetPercentile={responseTimeConfidenceTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksFlowMetrics}
                cycleTimeTarget={cycleTimeTarget}
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
          render={({view}) => (
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
                includeSubTasksInNonClosedState: includeSubTasksWipInspector,
              }}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="wip-volume"
          title=""
          className="tw-row-start-3"
          render={({view}) => {
            return (
              <DimensionWipMetricsWidget
                dimension="project"
                instanceKey={key}
                displayBag={{
                  metric: "volume",
                  displayType: "cardAdvanced",
                  displayProps: {
                    trendsView: {title: "Total", content: <span>Volume Trends</span>},
                    info: {title: "Info", content: "content"},
                  },
                }}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksWipInspector}
              />
            );
          }}
          showDetail={false}
        />
        <DashboardWidget
          name="quadrant-summary-pipeline"
          className="tw-row-start-3 tw-col-start-2 tw-col-span-3"
          title={""}
          subtitle={""}

          render={({view}) => (
            <DimensionPipelineQuadrantSummaryWidget
              dimension={'project'}
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
          className="tw-col-start-5 tw-row-start-3"
          render={({view}) => {
            return (
              <DimensionWipMetricsWidget
                dimension="project"
                instanceKey={key}
                displayBag={{
                  metric: "avgAge",
                  displayType: "cardAdvanced",
                  displayProps: {
                    trendsView: {title: "Age", content: <span>Trends</span>},
                    info: {title: "Info", content: "content"},
                  },
                }}
                targetPercentile={responseTimeConfidenceTarget}
                leadTimeTargetPercentile={leadTimeConfidenceTarget}
                cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                cycleTimeTarget={cycleTimeTarget}
                specsOnly={specsOnly}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                includeSubTasks={includeSubTasksWipInspector}
              />
            );
          }}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}
export const dashboard = ({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60} render={(props) => <NewFlowDashboard {...props} />} />
);
export default withViewerContext(dashboard);
