import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ProjectResponseTimeTrendsWidget} from "./responseTimeTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../../shared/components/trendingControlBar/trendingControlBar";
import {ProjectDeliveryCycleFlowMetricsWidget} from '../flowMetrics/projectDeliveryCycleFlowMetricsWidget';
import {getFlowMetricsRowTitle} from "../../helper/utils";

const dashboard_id = 'dashboards.trends.projects.response-time.detail';

function getSeriesName(seriesName) {
  const objMap = {
    avgCycleTime: "cycleTime",
    avgLeadTime: "leadTime",
    avgLatency: "latency",
    avgDuration: "duration",
    avgEffort: "effort"
  }

  return objMap[seriesName] != null ? objMap[seriesName] : seriesName;
}

export const ProjectResponseTimeTrendsDetailDashboard = (
  {

    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    targetPercentile,
    pollInterval,
    defaultSeries
  }
) => {
  const [before, setBefore] = React.useState();
  const [seriesName, setSeriesName] = React.useState("cycleTime");
  const selectedPointSeries = getSeriesName(seriesName);

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
        title={`Response Time Trends`}
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
          name="response-time-trends"
          render={
            ({view}) =>
              <ProjectResponseTimeTrendsWidget
                instanceKey={instanceKey}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                days={daysRange}
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
                targetPercentile={targetPercentile}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                setBefore={setBefore}
                setSeriesName={setSeriesName}
                defaultSeries={defaultSeries}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h="45%" title={getFlowMetricsRowTitle(measurementWindowRange, before)}>
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
              days={measurementWindowRange}
              before={before}
              initialMetric={selectedPointSeries}
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