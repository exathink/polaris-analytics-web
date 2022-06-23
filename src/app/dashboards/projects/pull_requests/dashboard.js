import React from "react";

import {DimensionPullRequestsDetailDashboard} from "../../shared/widgets/pullRequests/openPullRequests";
import {ProjectDashboard} from "../projectDashboard";

export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60 * 1000}
    render={({project, context}) => (
      <DimensionPullRequestsDetailDashboard
        dimension={"project"}
        instanceKey={project.key}
        latestWorkItemEvent={project.latestWorkItemEvent}
        latestCommit={project.latestCommit}
        latestPullRequestEvent={project.latestPullRequestEvent}
        context={context}
        days={30}
        measurementWindow={7}
        samplingFrequency={7}
      />
    )}
  />
);
export default dashboard;
