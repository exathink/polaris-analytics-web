import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {WorkItemStateTypes} from "../../shared/config";
import {
  ProjectPipelineCycleTimeLatencyWidget,
  ProjectPipelineImplementationCostWidget,
  ProjectPipelineWidget,
} from "../shared/widgets/wip";

import {DimensionCommitsNavigatorWidget, HeaderMetrics} from "../../shared/widgets/accountHierarchy";

import {withViewerContext} from "../../../framework/viewer/viewerContext";

import {ProjectDashboard} from "../projectDashboard";
import {ProjectResponseTimeSLAWidget} from "../shared/widgets/responseTimeSLA";
import {ProjectFlowMetricsWidget} from "../shared/widgets/flowMetrics";
import {ProjectPullRequestsWidget} from "./pullRequests";
import {useProjectWorkItemSourcesStateMappings} from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import {StateMappingIndex} from "../shared/stateMappingIndex";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";

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
    pipelineMeasurementWindow: measurementWindow,
  } = settingsWithDefaults;

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h="12%">
        <DashboardWidget
          w={0.16}
          name="response-time-sla"
          title={"Cycle Time"}
          subtitle={`Last ${measurementWindow} Days`}
          render={() => (
            <ProjectResponseTimeSLAWidget
              instanceKey={key}
              days={measurementWindow}
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
          w={0.3}
          name="pipeline"
          title={"Work In Progress"}
          render={({view}) => (
            <ProjectPipelineWidget
              instanceKey={key}
              display={"flowboardSummary"}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
              days={measurementWindow}
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
          w={0.2}
          name={"code-reviews"}
          title={"Code Reviews"}
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
          w={0.4}
          name="flow-metrics"
          title={"Closed"}
          subtitle={`Last ${measurementWindow} days`}
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
              days={measurementWindow}
              measurementWindow={measurementWindow}
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
          w={1 / 3}
          name="engineering"
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
          w={1 / 3}
          name="pipeline-effort"
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
          w={1 / 3}
          name="delivery"
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
      <DashboardRow h={"50%"}>
        <DashboardWidget
          title={"Latest Commits"}
          w={1}
          name="commits"
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
              groupBy={"workItem"}
              groupings={["workItem", "author", "repository", "branch"]}
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
