import React from "react";
import {ProjectDashboard} from "../projectDashboard";

export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60 * 1000}
    render={({project, context}) => {
    //   const {
    //     leadTimeTarget,
    //     cycleTimeTarget,
    //     responseTimeConfidenceTarget,
    //     leadTimeConfidenceTarget,
    //     cycleTimeConfidenceTarget,
    //     flowAnalysisPeriod,
    //     includeSubTasksFlowMetrics,
    //     latencyTarget,
    //   } = project.settingsWithDefaults;

      return <div className="tw-text-2xl tw-text-gray-300">First Dashboard</div>;
    }}
  />
);
export default dashboard;
