import React, { useState } from "react";
import {
  Dashboard,
  DashboardRow,
  DashboardWidget,
} from "../../../framework/viz/dashboard";
import { WorkItemStateTypes } from "../../shared/config";
import {
  ProjectPipelineCycleTimeLatencyWidget,
  ProjectPipelineWidget,
} from "../shared/widgets/wip";

import {
  DimensionCommitsNavigatorWidget,
  HeaderMetrics,
} from "../../shared/widgets/accountHierarchy";

import { withViewerContext } from "../../../framework/viewer/viewerContext";

import { ProjectDashboard } from "../projectDashboard";
import { ProjectTraceabilityTrendsWidget } from "../shared/widgets/traceability";
import { ProjectResponseTimeSLAWidget } from "../shared/widgets/responseTimeSLA";
import { ProjectFlowMetricsWidget } from "../shared/widgets/flowMetrics";
import { ProjectOpenPullRequestsWidget } from "./pullRequests";
import { ProjectPipelineImplementationCostWidget } from "../shared/widgets/wip";
import { useProjectWorkItemSourcesStateMappings } from "../shared/hooks/useQueryProjectWorkItemsSourceStateMappings";
import { StateMappingIndex } from "./new_dashboard";
import { GroupingSelector } from "../../shared/components/groupingSelector/groupingSelector";

const dashboard_id = "dashboards.activity.projects.newDashboard.instance";

export const dashboard = ({ viewerContext }) => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={({
      project: { key, latestWorkItemEvent, latestCommit, settings },
      context,
    }) => {
      const stateMappingIndex = new StateMappingIndex(
        useProjectWorkItemSourcesStateMappings(key)
      );
      const [workItemScope, setWorkItemScope] = useState("specs");
      const [engineeringTab, setEngineeringTab] = useState("cycleTime");
      const specsOnly = workItemScope === "specs";

      const { flowMetricsSettings } = settings;
      const leadTimeTarget = flowMetricsSettings.leadTimeTarget || 30;
      const cycleTimeTarget = flowMetricsSettings.cycleTimeTarget || 7;
      const responseTimeConfidenceTarget =
        flowMetricsSettings.responseTimeConfidenceTarget || 1.0;
      const leadTimeConfidenceTarget =
        flowMetricsSettings.leadTimeConfidenceTarget ||
        responseTimeConfidenceTarget;
      const cycleTimeConfidenceTarget =
        flowMetricsSettings.cycleTimeConfidenceTarget ||
        responseTimeConfidenceTarget;
      const wipLimit = flowMetricsSettings.wipLimit || 20;

      const measurementWindow = flowMetricsSettings.pipelineMeasurementWindow || 7;

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
              w={0.25}
              name="pipeline"
              title={"Work In Progress"}
              render={({ view }) => (
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
              w={0.45}
              name="flow-metrics"
              title={"Closed"}
              subtitle={`Last ${measurementWindow} days`}
              hideTitlesInDetailView={true}
              render={({ view }) => (
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
                  leadTimeTargetPercentile={leadTimeConfidenceTarget}
                  cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
                  leadTimeTarget={leadTimeTarget}
                  cycleTimeTarget={cycleTimeTarget}
                />
              )}
              showDetail={true}
            />
            <DashboardWidget
              w={0.12}
              name="traceability"
              title={"Traceability"}
              hideTitlesInDetailView={"true"}
              render={({ view }) => (
                <ProjectTraceabilityTrendsWidget
                  instanceKey={key}
                  measurementWindow={measurementWindow}
                  days={7}
                  samplingFrequency={7}
                  context={context}
                  view={view}
                  latestWorkItemEvent={latestWorkItemEvent}
                  latestCommit={latestCommit}
                  asStatistic={{ title: "Current" }}
                  target={0.9}
                />
              )}
              showDetail={true}
            />
          </DashboardRow>
          <DashboardRow h="36%" title={" "}>
            <DashboardWidget
              w={1 / 3}
              name="engineering"
              title={"Build"}
              styles={{
                controlContainer: {
                  width: "53%",
                },
              }}
              controls={[
                () => (
                  <GroupingSelector
                    label={" "}
                    groupings={[
                      {
                        key: "cycleTime",
                        display: "Cycle Time",
                      },
                      {
                        key: "codeReviews",
                        display: "Code Reviews",
                      },
                    ]}
                    initialValue={engineeringTab}
                    onGroupingChanged={(selection) =>
                      setEngineeringTab(selection)
                    }
                  />
                ),
              ]}
              render={({ view }) =>
                engineeringTab === "cycleTime" ? (
                  <ProjectPipelineCycleTimeLatencyWidget
                    instanceKey={key}
                    view={view}
                    stageName={"Engineering"}
                    stateTypes={[
                      WorkItemStateTypes.open,
                      WorkItemStateTypes.build,
                    ]}
                    cycleTimeTarget={cycleTimeTarget}
                    specsOnly={specsOnly}
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                    context={context}
                    latestWorkItemEvent={latestWorkItemEvent}
                    latestCommit={latestCommit}
                    targetPercentile={cycleTimeConfidenceTarget}
                  />
                ) : (
                  <ProjectOpenPullRequestsWidget
                    instanceKey={key}
                    view={view}
                    context={context}
                    latestWorkItemEvent={latestWorkItemEvent}
                    latestCommit={latestCommit}
                  />
                )
              }
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 3}
              name="pipeline-effort"
              render={({ view }) => (
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
              title={'Deliver'}
              styles={{
                controlContainer: {
                  width: "50%",
                },
              }}
              controls={[
                () => '',
              ]}
              render={({ view }) => (
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
              render={({ view }) => (
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
    }}
  />
);
;
export default withViewerContext(dashboard);
