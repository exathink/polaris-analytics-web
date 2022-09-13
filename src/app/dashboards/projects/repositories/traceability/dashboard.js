import React from "react";

import { Dashboard, DashboardRow } from "../../../../framework/viz/dashboard";
import { ProjectDashboard } from "../../projectDashboard";
import {
  ProjectTraceabilityTrendsDetailDashboard
} from "../../../shared/widgets/commits/traceability/traceabilityTrendsDetailDashboard";


const dashboard_id = "dashboards.activity.organization.instance";


export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60 * 1000}
    render={
      ({ project, context }) => {
        const {
          flowAnalysisPeriod,
          latestCommit,
          latestWorkItemEvent
        } = project.settingsWithDefaults;

        const days = flowAnalysisPeriod;
        return (
          <Dashboard dashboard={`${dashboard_id}`}>
            <DashboardRow h={"100%"}>
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
            </DashboardRow>
          </Dashboard>
        );
      }}
  />
);
export default dashboard;