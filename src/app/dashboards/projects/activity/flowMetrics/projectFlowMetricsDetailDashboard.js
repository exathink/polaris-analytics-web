import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectFlowMetricsWidget} from "./projectFlowMetricsWidget";
import {ProjectDeliveryCycleFlowMetricsWidget} from "./projectDeliveryCycleFlowMetricsWidget";

const dashboard_id = 'dashboards.activity.projects.cycleMetrics.detail';

export const ProjectFlowMetricsDetailDashboard = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile

  }) => (
  <Dashboard dashboard={dashboard_id}>
    <DashboardRow h={"15%"}>
      <DashboardWidget
        w={1}
        name="cycle-metrics-summary-detailed"
        render={
          ({view}) =>
            <ProjectFlowMetricsWidget
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
    <DashboardRow h={"80%"}>
      <DashboardWidget
        w={1}
        name="cycle-metrics-delivery-details"
        render={
          ({view}) =>
            <ProjectDeliveryCycleFlowMetricsWidget
              instanceKey={instanceKey}
              view={view}
              showAll={true}
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