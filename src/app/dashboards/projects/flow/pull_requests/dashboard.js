import React from "react";

import {DimensionPullRequestsDetailDashboard} from "../../../shared/widgets/pullRequests/openPullRequests";
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";

export const PullRequestsDashboard = () => {
  const {project, context} = useProjectContext();
  const {
    leadTimeTarget,
    cycleTimeTarget,
    responseTimeConfidenceTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    flowAnalysisPeriod,
    includeSubTasksFlowMetrics,
    latencyTarget,
  } = project.settingsWithDefaults;

  return (
    <DimensionPullRequestsDetailDashboard
      dimension={"project"}
      instanceKey={project.key}
      latestWorkItemEvent={project.latestWorkItemEvent}
      latestCommit={project.latestCommit}
      latestPullRequestEvent={project.latestPullRequestEvent}
      context={context}
      specsOnly={true}
      days={flowAnalysisPeriod}
      measurementWindow={flowAnalysisPeriod}
      samplingFrequency={flowAnalysisPeriod}
      latencyTarget={latencyTarget}
      cycleTimeTarget={cycleTimeTarget}
      leadTimeTarget={leadTimeTarget}
      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
      responseTimeConfidenceTarget={responseTimeConfidenceTarget}
      includeSubTasks={includeSubTasksFlowMetrics}
    />
  );
};
const dashboard = () => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <PullRequestsDashboard />
  </ProjectDashboard>
);

export default dashboard;
