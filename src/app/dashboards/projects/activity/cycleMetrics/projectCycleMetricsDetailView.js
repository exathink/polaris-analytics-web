import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectCycleMetricsWidget} from "./projectCycleMetricsWidget";

const dashboard_id = 'dashboards.activity.projects.cycleMetrics.detail';

export const ProjectCycleMetricsDetailView = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile

  }) => (
  <Dashboard dashboard={dashboard_id}>
    <DashboardRow h={0.3}>
      <DashboardWidget
        w={1}
        name="cycle-metrics-summary-detailed"
        render={
          ({view}) =>
            <ProjectCycleMetricsWidget
              instanceKey={instanceKey}
              view={view}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              stateMappingIndex={stateMappingIndex}
              days={days}
              targetPercentile={targetPercentile}
            />
        }
        showDetail={false}
      />
    </DashboardRow>
  </Dashboard>
);