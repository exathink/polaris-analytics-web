import React from "react";
import { ProjectDashboard, useProjectContext } from "../../projectDashboard";
import {
  ProjectTraceabilityTrendsDetailDashboard
} from "../../../shared/widgets/commits/traceability/traceabilityTrendsDetailDashboard";


export const ProjectTraceabilityDashboard = () => {
  const {project, context} = useProjectContext();
  const {flowAnalysisPeriod, latestCommit, latestWorkItemEvent} = project.settingsWithDefaults;

  const days = flowAnalysisPeriod;
  return (
    <ProjectTraceabilityTrendsDetailDashboard
      instanceKey={project.key}
      days={days}
      measurementWindow={7}
      samplingFrequency={7}
      context={context}
      target={0.9}
      latestCommit={latestCommit}
      latestWorkItemEvent={latestWorkItemEvent}
    />
  );
};

const dashboard = () => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <ProjectTraceabilityDashboard />
  </ProjectDashboard>
);

export default dashboard;