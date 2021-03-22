import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ProjectVolumeTrendsWidget} from "./throughputTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../../shared/components/trendingControlBar/trendingControlBar";
import {ProjectDeliveryCycleFlowMetricsWidget} from '../flowMetrics/projectDeliveryCycleFlowMetricsWidget';

const dashboard_id = 'dashboards.trends.projects.throughput.detail';


export const ProjectVolumeTrendsDetailDashboard = (
  {

    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    pollInterval
  }
) => {
  const [before, setBefore] = React.useState();
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={"40%"}
        title={`Volume Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={
          getTrendsControlBarControls(
            [
              [daysRange, setDaysRange],
              [measurementWindowRange, setMeasurementWindowRange],
              [frequencyRange, setFrequencyRange]
            ]
          )
        }
      >
        <DashboardWidget
          w={1}
          name="cycle-metrics-summary-detailed"
          render={
            ({view}) =>
              <ProjectVolumeTrendsWidget
                instanceKey={instanceKey}

                view={view}
                setBefore={setBefore}
                latestWorkItemEvent={latestWorkItemEvent}
                days={daysRange}
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
                targetPercentile={targetPercentile}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="60%" title={before ? `Before Date: ${before} `: `Before Date: `}>
        <DashboardWidget
          w={1}
          name="flow-metrics-delivery-details"
          render={({view}) => (
            <ProjectDeliveryCycleFlowMetricsWidget
              instanceKey={instanceKey}
              specsOnly={true}
              view={view}
              context={context}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              days={daysRange}
              before={before}
              initialMetric={"cycleTime"}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}