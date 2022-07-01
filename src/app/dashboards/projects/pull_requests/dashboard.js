import React from "react";

import {DimensionPullRequestsDetailDashboard} from "../../shared/widgets/pullRequests/openPullRequests";
import {ProjectDashboard} from "../projectDashboard";

export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60 * 1000}
    render={({project, context}) => {
      const {
        leadTimeTarget,
        cycleTimeTarget,
        responseTimeConfidenceTarget,
        leadTimeConfidenceTarget,
        cycleTimeConfidenceTarget,
        flowAnalysisPeriod,
        includeSubTasksFlowMetrics,
        latencyTarget
      } = project.settingsWithDefaults;

      return (
        <DimensionPullRequestsDetailDashboard
          dimension={"project"}
          instanceKey={project.key}
          latestWorkItemEvent={project.latestWorkItemEvent}
          latestCommit={project.latestCommit}
          latestPullRequestEvent={project.latestPullRequestEvent}
          context={context}
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
    }}
  />
);
export default dashboard;
