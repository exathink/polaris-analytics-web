import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectPipelineWidget} from "./projectPipelineWidget";
import {ProjectPipelineStateDetailsWidget} from "./projectPipelineStateDetailsWidget";

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
    <DashboardRow h={"83%"}>
      <DashboardWidget
        w={1}
        name="project-pipeline-state-detail-view"
        render={
          ({view}) =>
            <ProjectPipelineStateDetailsWidget
              instanceKey={instanceKey}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              stateMappingIndex={stateMappingIndex}
            />
        }
        showDetail={true}
      />
    </DashboardRow>
  </Dashboard>
);