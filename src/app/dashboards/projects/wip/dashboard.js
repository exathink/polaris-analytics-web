import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {WorkItemStateTypes} from "../../shared/config";
import styles from "./dashboard.module.css";
import {DimensionCommitsNavigatorWidget, HeaderMetrics} from "../../shared/widgets/accountHierarchy";

import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";
import {ProjectResponseTimeSLAWidget} from "../shared/widgets/responseTimeSLA";
import {DimensionFlowMetricsWidget} from "../../shared/widgets/work_items/closed/flowMetrics";
import {DimensionPipelineCycleTimeLatencyWidget, DimensionWipFlowMetricsWidget} from "../../shared/widgets/work_items/wip";
import {DimensionPullRequestsWidget} from "../../shared/widgets/pullRequests/openPullRequests";
import {useProjectWorkItemSourcesStateMappings} from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {StateMappingIndex} from "../shared/stateMappingIndex";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../shared/components/workItemScopeSelector";
import { ProjectValueBookWidget } from "../../shared/widgets/work_items/valueBook";
import {SYSTEM_TEAMS} from "../../../../config/featureFlags";


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
          name="response-time-sla"
          className={styles.responseTimeSLA}
          title={"Cycle Time"}
          subtitle={`Last ${wipAnalysisPeriod} Days`}
          render={() => (
            <ProjectResponseTimeSLAWidget
              instanceKey={key}
              days={wipAnalysisPeriod}
              metric={"cycleTime"}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              latestWorkItemEvent={latestWorkItemEvent}
              specsOnly={specsOnly}
              includeSubTasks={includeSubTasksWipInspector}
            />
          )}
        />

        <DashboardWidget
          name="pipeline"
          className={styles.pipeline}
          title={"Work In Progress"}
          videoConfig={DimensionWipFlowMetricsWidget.videoConfig}
          render={({view}) => (
            <DimensionWipFlowMetricsWidget
              dimension={'project'}
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
          showDetail={true}
          hideTitlesInDetailView={true}
        />
        <DashboardWidget
          name={"code-reviews"}
          className={styles.codeReviews}
          title={"Review Requests"}
          render={({view}) => (
            <DimensionPullRequestsWidget
              dimension={'project'}
              instanceKey={key}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              asStatistic={true}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="flow-metrics"
          className={styles.flowMetrics}
          title={"Closed"}
          subtitle={`Last ${wipAnalysisPeriod} days`}
          hideTitlesInDetailView={true}
          render={({view}) => (
            <DimensionFlowMetricsWidget
              dimension={'project'}
              instanceKey={key}
              view={view}
              display={"performanceSummary"}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
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
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h="36%" title={" "}>
        <DashboardWidget
          name="engineering"
          className={styles.engineering}
          videoConfig={DimensionPipelineCycleTimeLatencyWidget.videoConfig}
          render={({view}) => (
            <DimensionPipelineCycleTimeLatencyWidget
              dimension={"project"}
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
          name="epic-flow-mix-wip"
          className={styles.pipelineEffort}
          render={({ view }) => (
            <ProjectValueBookWidget
              instanceKey={key}
              context={context}
              specsOnly={specsOnly}
              activeOnly={true}
              view={view}
              latestCommit={latestCommit}

              latestWorkItemEvent={latestWorkItemEvent}
              includeSubTasks={includeSubTasksWipInspector}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
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
              headerMetric={HeaderMetrics.latestCommit}
              groupBy={teamsActive ? "team" : 'workItem'}
              groupings={
                teamsActive ?
                  ["team", "author", "workItem",  "repository"]
                  :
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
export const dashboard = ({viewerContext}) => <ProjectDashboard pollInterval={1000 * 60} render={props => <WipDashboard viewerContext={viewerContext}  {...props}/>} />;
export default withViewerContext(dashboard);
