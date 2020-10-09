import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";

import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../shared/components/trendingControlBar/trendingControlBar";
import {ProjectCapacityTrendsWidget} from "./capacityTrendsWidget";

const dashboard_id = 'dashboards.trends.projects.capacity.detail';

export const ProjectCapacityTrendsDetailDashboard = (
  {
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    pollInterval
  }) => {

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(45, 30, 7);


  return (
    <Dashboard
      dashboard={dashboard_id}
    >
      <DashboardRow
        h={1}
        title={`Capacity Trends`}
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
          name="capacity-trends-detail"
          render={
            ({view}) =>
              <ProjectCapacityTrendsWidget
                instanceKey={instanceKey}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={daysRange}
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}