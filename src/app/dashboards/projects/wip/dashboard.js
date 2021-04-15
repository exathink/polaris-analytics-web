import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {WorkItemStateTypes} from "../../shared/config";
import {
  ProjectPipelineCycleTimeLatencyWidget,
  ProjectPipelineImplementationCostWidget,
  ProjectPipelineWidget,
} from "../shared/widgets/wip";
import styles from "./dashboard.module.css";
import {DimensionCommitsNavigatorWidget, HeaderMetrics} from "../../shared/widgets/accountHierarchy";

import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";
import {ProjectResponseTimeSLAWidget} from "../shared/widgets/responseTimeSLA";
import {ProjectFlowMetricsWidget} from "../shared/widgets/flowMetrics";
import {ProjectPullRequestsWidget} from "./pullRequests";
import {useProjectWorkItemSourcesStateMappings} from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {StateMappingIndex} from "../shared/stateMappingIndex";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../shared/components/workItemScopeSelector";

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
}) {
  const stateMappingIndex = new StateMappingIndex(useProjectWorkItemSourcesStateMappings(key));
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

  const {
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    wipLimit,
    wipAnalysisPeriod,
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
            />
          )}
        />

        <DashboardWidget
          name="pipeline"
          className={styles.pipeline}
          title={"Work In Progress"}
          videoConfig={ProjectPipelineWidget.videoConfig}
          render={({view}) => (
            <ProjectPipelineWidget
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
            <ProjectPullRequestsWidget
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
            <ProjectFlowMetricsWidget
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
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h="36%" title={" "}>
        <DashboardWidget
          name="engineering"
          className={styles.engineering}
          videoConfig={ProjectPipelineCycleTimeLatencyWidget.videoConfig}
          render={({view}) => (
            <ProjectPipelineCycleTimeLatencyWidget
              instanceKey={key}
              view={view}
              stageName={"Engineering"}
              stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make]}
              cycleTimeTarget={cycleTimeTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={cycleTimeConfidenceTarget}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="pipeline-effort"
          className={styles.pipelineEffort}    
          render={({view}) => (
            <ProjectPipelineImplementationCostWidget
              instanceKey={key}
              view={view}
              specsOnly={specsOnly}
              wipLimit={wipLimit}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
            />
          )}
          showDetail={true}
        />
        <DashboardWidget
          name="delivery"
          className={styles.delivery}
          render={({view}) => (
            <ProjectPipelineCycleTimeLatencyWidget
              instanceKey={key}
              view={view}
              stageName={"Delivery"}
              stateTypes={[WorkItemStateTypes.deliver]}
              groupByState={true}
              cycleTimeTarget={cycleTimeTarget}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={cycleTimeConfidenceTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
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
              groupBy={"author"}
              groupings={["author", "workItem",  "repository", "branch"]}
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
export const dashboard = ({viewerContext}) => <ProjectDashboard pollInterval={1000 * 60} render={props => <WipDashboard {...props}/>} />;
export default withViewerContext(dashboard);
