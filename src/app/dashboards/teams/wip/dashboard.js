import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {TeamDashboard} from "../teamDashboard";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import styles from "../../projects/wip/dashboard.module.css";
import { DimensionCommitsNavigatorWidget, HeaderMetrics } from "../../shared/widgets/accountHierarchy";
import {
  DimensionWipFlowMetricsWidget,
  DimensionPipelineCycleTimeLatencyWidget
} from "../../shared/widgets/work_items/wip";
import { WorkItemStateTypes } from "../../shared/config";
import { DimensionPullRequestsWidget } from "../../shared/widgets/pullRequests/openPullRequests";

const dashboard_id = "dashboards.activity.teams.instance";


export const dashboard = (
  {viewerContext}
) =>
  <TeamDashboard
    pollInterval={1000 * 60}
    render={
      props => <WipDashboard viewerContext={viewerContext}  {...props}/>
    }
  />;

function WipDashboard({
  team: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext
}) {
  const [workItemScope, setWorkItemScope] = useState("specs");
  const specsOnly = workItemScope === "specs";
  const {
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    wipLimit,
    wipAnalysisPeriod,
    includeSubTasksWipInspector,
    includeSubTasksFlowMetrics,
    latencyTarget
  } = settingsWithDefaults;
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h="15%">
        <DashboardWidget
          name="flow-metrics"
          title={"Flow Metrics"}
          w={1/2}
          subtitle={`Last ${wipAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <DimensionFlowMetricsWidget
              dimension={"team"}
              instanceKey={key}
              view={view}
              display={"performanceSummary"}
              context={context}
              specsOnly={specsOnly}
              days={wipAnalysisPeriod}
              measurementWindow={wipAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="pipeline"
          w={1/2}
          title={"Work In Progress"}
          videoConfig={DimensionWipFlowMetricsWidget.videoConfig}
          render={({view}) => (
            <DimensionWipFlowMetricsWidget
              dimension={'team'}
              instanceKey={key}
              display={"flowboardSummary"}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              days={wipAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTargetPercentile={leadTimeConfidenceTarget}
              cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
              cycleTimeTarget={cycleTimeTarget}
              wipLimit={wipLimit}
              view={view}
              specsOnly={specsOnly}
              context={context}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={false}
          hideTitlesInDetailView={true}
        />
      </DashboardRow>
      <DashboardRow h="30%" title={"Latency & Delays"}>
        <DashboardWidget
          name="engineering"
          w={1/3}
          className={styles.engineering}
          videoConfig={DimensionPipelineCycleTimeLatencyWidget.videoConfig}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={'team'}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Engineering"}
              stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name={"code-reviews"}
          w={1/3}
          className={styles.codeReviews}
          render={({view}) => (
            <DimensionPullRequestsWidget
              dimension={'team'}
              instanceKey={key}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              asStatistic={false}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="delivery"
          w={1/3}
          videoConfig={DimensionPipelineCycleTimeLatencyWidget.videoConfig}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={'team'}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Delivery"}
              stateTypes={[WorkItemStateTypes.complete]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h={"50%"} title={"Latest Commits"}>
        <DashboardWidget
          name="commits"
          w={1}
          render={({view}) => (
            <DimensionCommitsNavigatorWidget
              dimension={"team"}
              instanceKey={key}
              context={context}
              view={view}
              days={1}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              headerMetric={HeaderMetrics.latestCommit}
              groupBy={'author'}
              groupings={
                  ["author", "workItem",  "repository", "branch"]
              }
              showHeader
              showTable
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}

export default withViewerContext(dashboard)

