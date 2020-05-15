import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectDefectMetricsWidget} from "./projectDefectMetricsWidget";
import {ProjectDeliveryCycleFlowMetricsWidget} from "../flowMetrics/projectDeliveryCycleFlowMetricsWidget";
import {DaysRangeSlider} from "../../../shared/components/daysRangeSlider/daysRangeSlider";

const dashboard_id = 'dashboards.activity.projects.defectMetrics.detail';

export const ProjectDefectMetricsDetailDashboard = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile

  }) => {
  const [daysRange, setDaysRange] = useState(days || 30)
  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"20%"}
        title={`Defect Metrics`}
        subTitle={`Last ${daysRange} days`}
        controls={[
          () =>
            <div style={{minWidth: "500px"}}>
              <DaysRangeSlider initialDays={daysRange} setDaysRange={setDaysRange}/>
            </div>
        ]}
      >
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
                days={daysRange}
                targetPercentile={targetPercentile}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h={"75%"}>
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
                days={daysRange}
                targetPercentile={targetPercentile}
                defectsOnly={true}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
};