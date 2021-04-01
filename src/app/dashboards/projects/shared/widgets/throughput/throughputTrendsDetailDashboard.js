import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ProjectVolumeTrendsWidget} from "./throughputTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../../shared/components/trendingControlBar/trendingControlBar";
import {ProjectDeliveryCycleFlowMetricsWidget} from '../flowMetrics/projectDeliveryCycleFlowMetricsWidget';
import {getFlowMetricsRowTitle} from "../../helper/utils";

const dashboard_id = 'dashboards.trends.projects.throughput.detail';

function getSeriesName(seriesName) {
  const objMap = {
    workItemsInScope: "Cards",
    workItemsWithCommits: "Specs",
  }

  return objMap[seriesName] != null ? objMap[seriesName] : seriesName;
}

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
  const [seriesName, setSeriesName] = React.useState("workItemsWithCommits");
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
                setSeriesName={setSeriesName}
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
      <DashboardRow h="45%" title={getFlowMetricsRowTitle(measurementWindowRange, before)}>
        <DashboardWidget
          w={1}
          name="flow-metrics-delivery-details"
          render={({view}) => (
            <ProjectDeliveryCycleFlowMetricsWidget
              instanceKey={instanceKey}
              specsOnly={selectedPointSeries === "Specs"}
              view={view}
              context={context}
              showAll={true}
              latestWorkItemEvent={latestWorkItemEvent}
              days={measurementWindowRange}
              before={before}
              initialMetric={"leadTime"}
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