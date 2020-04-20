import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectDefectMetricsWidget} from "./projectDefectMetricsWidget";
import {ProjectDeliveryCycleFlowMetricsWidget} from "../flowMetrics/projectDeliveryCycleFlowMetricsWidget";

const dashboard_id = 'dashboards.activity.projects.defectMetrics.detail';

export const ProjectDefectMetricsDetailDashboard = (
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
        name="defect-metrics-summary-detailed"
        render={
          ({view}) =>
            <ProjectDefectMetricsWidget
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
        name="defect-cycle-metrics-delivery-details"
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
              defectsOnly={true}
            />
        }
        showDetail={true}
      />
    </DashboardRow>
  </Dashboard>
);