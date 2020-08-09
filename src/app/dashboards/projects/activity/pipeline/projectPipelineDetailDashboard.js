import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectPhaseSummaryWidget} from "./projectPhaseSummaryWidget";
import {ProjectPipelineStateDetailsWidget} from "./projectPipelineStateDetailsWidget";

const dashboard_id = 'dashboards.activity.projects.pipeline.detail';

export const ProjectPipelineDetailDashboard = (
  {
    instanceKey,
    context,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile,
  }) => (
  <Dashboard dashboard={dashboard_id}>
    <DashboardRow h={"15%"}>
      <DashboardWidget
        w={1/4}
        name="project-pipeline-summary-detail-view"
        render={
          ({view}) =>
            <ProjectPhaseSummaryWidget
              instanceKey={instanceKey}
              view={view}
              latestWorkItemEvent={latestWorkItemEvent}
              stateMappingIndex={stateMappingIndex}
            />
        }
        showDetail={false}
      />
    </DashboardRow>
    <DashboardRow h={"81%"}>
      <DashboardWidget
        w={1}
        name="project-pipeline-state-detail-view"
        render={
          ({view}) =>
            <ProjectPipelineStateDetailsWidget
              instanceKey={instanceKey}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              stateMappingIndex={stateMappingIndex}
              days={days}
              targetPercentile={targetPercentile}
            />
        }
        showDetail={true}
      />
    </DashboardRow>
  </Dashboard>
);