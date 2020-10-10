import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectResponseTimeTrendsWidget} from "./responseTimeTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../shared/components/trendingControlBar/trendingControlBar";

const dashboard_id = 'dashboards.trends.projects.response-time.detail';


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
    targetPercentile,
    pollInterval
  }
) => {

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
              />
          }
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
}