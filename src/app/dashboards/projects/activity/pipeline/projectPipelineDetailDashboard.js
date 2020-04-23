import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectPipelineWidget} from "./projectPipelineWidget";


const dashboard_id = 'dashboards.activity.projects.pipeline.detail';

export const ProjectPipelineDetailDashboard = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,

  }) => (
  <Dashboard dashboard={dashboard_id}>
    <DashboardRow h={"15%"}>
      <DashboardWidget
        w={1}
        name="project-pipeline-summary-detail-view"
        render={
          ({view}) =>
            <ProjectPipelineWidget
              instanceKey={instanceKey}
              view={view}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              stateMappingIndex={stateMappingIndex}
            />
        }
        showDetail={false}
      />
    </DashboardRow>
  </Dashboard>
);