import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {ProjectPullRequestTrendsWidget} from "./pullRequestTrendsWidget";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../../shared/components/trendingControlBar/trendingControlBar";

const dashboard_id = "dashboards.trends.projects.pullrequests.detail";

export const ProjectPullRequestTrendsDetailDashboard = ({
  instanceKey,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
}) => {
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={1}
        title={`Code Review Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={getTrendsControlBarControls([
          [daysRange, setDaysRange],
          [measurementWindowRange, setMeasurementWindowRange],
          [frequencyRange, setFrequencyRange],
        ])}
      >
        <DashboardWidget
          w={1}
          name="pr-metrics-summary-detailed"
          render={({view}) => (
            <ProjectPullRequestTrendsWidget
              instanceKey={instanceKey}
              view={view}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
