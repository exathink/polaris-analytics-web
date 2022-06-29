import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import styles from "./dashboard.module.css";
import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";
import {
  DimensionPipelineCycleTimeLatencyWidget,
  DimensionWipFlowMetricsWidget,
} from "../../shared/widgets/work_items/wip";
import {WorkItemStateTypes} from "../../shared/config";
import {DimensionPullRequestsWidget} from "../../shared/widgets/pullRequests/openPullRequests";
import {DimensionResponseTimeWidget} from "../../shared/widgets/work_items/responseTime/dimensionResponseTimeWidget";
import {DimensionThroughputWidget} from "../../shared/widgets/work_items/throughput/dimensionThroughputWidget";

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
    <Dashboard dashboard={`${dashboard_id}`} gridLayout={true} className={styles.teamsFlowDashboard}>
      <DashboardRow h="15%">
        <DashboardWidget
          name="flow-metrics-response-time"
          title={"Response Time"}

          className={styles.responseTimeSLA}
          subtitle={`Last ${wipAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <DimensionResponseTimeWidget
              dimension={"team"}
              instanceKey={key}
              display={"responseTimeSummary"}
              view={view}
              context={context}
              specsOnly={specsOnly}
              days={wipAnalysisPeriod}
              measurementWindow={wipAnalysisPeriod}
              samplingFrequency={wipAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pipeline"
          
          className={styles.pipeline}
          title={"Work In Progress"}

          render={({view}) => (
            <DimensionWipFlowMetricsWidget
              dimension={'team'}
              instanceKey={key}
              display={"commonWipSummary"}
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
        <DashboardWidget
          name="flow-metrics-throughput"
          title={"Throughput"}

          className={styles.flowMetrics}
          subtitle={`Last ${wipAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <DimensionThroughputWidget
              dimension={"team"}
              instanceKey={key}
              view={view}
              context={context}
              specsOnly={specsOnly}
              days={wipAnalysisPeriod}
              measurementWindow={wipAnalysisPeriod}
              samplingFrequency={wipAnalysisPeriod}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasksFlowMetrics}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              normalized={true}
            />
          )}
          showDetail={false}
        />

      </DashboardRow>
      <DashboardRow h="30%" title={"Wip Age & Idle Time"} className={styles.wipAge}>
        <DashboardWidget
          name="engineering"
          
          className={styles.engineering}

          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={'team'}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Coding"}
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
              activeOnly={true}
              days={wipAnalysisPeriod}
              measurementWindow={wipAnalysisPeriod}
              samplingFrequency={wipAnalysisPeriod}
              display="histogram"
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="delivery"
          
          className={styles.delivery}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={'team'}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Delivery"}
              stateTypes={[WorkItemStateTypes.deliver]}
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
      <DashboardRow h={"50%"} title={"Latest Changes"} className={styles.latestCommitsTitle}>
        <DashboardWidget
          name="commits"
          className={styles.commits}
          
          render={({view}) => (
            <DimensionCommitsNavigatorWidget
              dimension={"team"}
              instanceKey={key}
              context={context}
              view={view}
              days={1}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              groupBy={'author'}
              groupings={
                  ["author", "workItem",   "repository", "branch"]
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

