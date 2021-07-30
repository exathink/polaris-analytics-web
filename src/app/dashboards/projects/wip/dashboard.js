import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {WorkItemStateTypes} from "../../shared/config";
import styles from "./dashboard.module.css";
import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";

import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";
import {
  DimensionPipelineCycleTimeLatencyWidget,
  DimensionWipFlowMetricsWidget,
} from "../../shared/widgets/work_items/wip";
import {DimensionPullRequestsWidget} from "../../shared/widgets/pullRequests/openPullRequests";
import {useProjectWorkItemSourcesStateMappings} from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {StateMappingIndex} from "../shared/stateMappingIndex";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector/workItemScopeSelector";
import {SYSTEM_TEAMS} from "../../../../config/featureFlags";
import {ResponseTimeWidget} from "../../shared/widgets/work_items/responseTime/responseTimeWidget";
import {DimensionThroughputWidget} from "../../shared/widgets/work_items/throughput/dimensionThroughputWidget";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";

WipDashboard.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "WIP Dashboard",
  VideoDescription: () => (
    <>
      <h2>Wip Dashboard</h2>
      <p> lorem ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
    </>
  ),
};

function WipDashboard({
  project: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext
}) {
  const stateMappingIndex = new StateMappingIndex(useProjectWorkItemSourcesStateMappings(key));
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";
  const teamsActive = viewerContext.isFeatureFlagActive(SYSTEM_TEAMS)
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
    <Dashboard dashboard={`${dashboard_id}`} dashboardVideoConfig={WipDashboard.videoConfig} className={styles.wipDashboard} gridLayout={true}>
      <DashboardRow h="12%">
        <DashboardWidget
          name="throughput-wip"
          title={"Throughput"}      
          className={styles.flowMetrics}
          subtitle={`Last ${wipAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({ view }) => (
            <DimensionThroughputWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              display={"throughputSummary"}
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
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="pipeline"
          className={styles.pipeline}
          title={"Work In Progress"}
          render={({view}) => (
            <DimensionWipFlowMetricsWidget
              dimension={'project'}
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
          name="response-time-wip"
          title={"Response Time"}       
          className={styles.responseTime}
          subtitle={`Last ${wipAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({view}) => (
            <ResponseTimeWidget
              dimension={'project'}
              instanceKey={key}
              view={view}
              display={"responseTimeSummary"}
              context={context}
              stateMappingIndex={stateMappingIndex}
              specsOnly={specsOnly}
              days={wipAnalysisPeriod}
              measurementWindow={wipAnalysisPeriod}
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
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h="36%" title={" "}>
        <DashboardWidget
          name="engineering"
          className={styles.engineering}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Implementation"}
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
          name="epic-flow-mix-wip"
          className={styles.codeReviewDetail}
          render={({ view }) => (
            <DimensionPullRequestsWidget
              dimension={'project'}
              instanceKey={key}
              className={styles.codeReviewDetail}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              asStatistic={false}
            />
          )}
          showDetail={false}
        />

        <DashboardWidget
          name="delivery"
          className={styles.delivery}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={"project"}
              instanceKey={key}
              view={view}
              tooltipType="small"
              stageName={"Delivery"}
              stateTypes={[WorkItemStateTypes.deliver]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={cycleTimeConfidenceTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <div className={styles.scopeSelector}>
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        </Flex>
      </div>
      <DashboardRow h={"50%"} title={"Latest Commits"} className={styles.latestCommitsTitle}>
        <DashboardWidget
          name="commits"
          className={styles.commits}
          render={({view}) => (
            <DimensionCommitsNavigatorWidget
              dimension={"project"}
              instanceKey={key}
              context={context}
              view={view}
              days={1}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              groupBy={'workItem'}
              groupings={
                teamsActive ?
                  ["workItem", "team", "author",  "repository", "branch"]
                  :
                  ["workItem", "author",  "repository", "branch"]

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
export const dashboard = ({viewerContext}) => <ProjectDashboard pollInterval={1000 * 60} render={props => <WipDashboard viewerContext={viewerContext}  {...props}/>} />;
export default withViewerContext(dashboard);
