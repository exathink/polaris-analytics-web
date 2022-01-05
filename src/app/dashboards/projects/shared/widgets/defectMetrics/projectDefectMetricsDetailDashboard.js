import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ProjectDefectMetricsWidget} from "./projectDefectMetricsWidget";
import {DimensionDeliveryCycleFlowMetricsWidget} from "../../../../shared/widgets/work_items/closed/flowMetrics/dimensionDeliveryCycleFlowMetricsWidget";
import {DaysRangeSlider} from "../../../../shared/components/daysRangeSlider/daysRangeSlider";

const dashboard_id = 'dashboards.activity.projects.defectMetrics.detail';

export const ProjectDefectMetricsDetailDashboard = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    view,
    context

  }) => {
  const [daysRange, setDaysRange] = useState(days || 30)
  const [yAxisScale, setYAxisScale] = React.useState("histogram");
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
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
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
              <DimensionDeliveryCycleFlowMetricsWidget
                dimension={'project'}
                instanceKey={instanceKey}
                view={view}
                context={context}
                showAll={true}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={daysRange}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeConfidenceTarget={leadTimeConfidenceTarget}
                cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
                defectsOnly={true}
                yAxisScale={yAxisScale}
                setYAxisScale={setYAxisScale}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
};