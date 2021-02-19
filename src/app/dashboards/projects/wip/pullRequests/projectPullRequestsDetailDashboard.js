import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {PullRequestsCompletedTrendsWidget} from "../../shared/widgets/pullRequestsCompleted";
import {PullRequestsReviewTimeTrendsWidget} from "../../shared/widgets/pullRequestsReviewTime";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../shared/components/trendingControlBar/trendingControlBar";
import {ProjectPullRequestsWidget} from "./projectPullRequestsWidget";

const dashboard_id = "dashboards.projects.wip.pullrequests.detail";

export const ProjectPullRequestsDetailDashboard = ({
  instanceKey,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
  latestCommit,
  latestPullRequestEvent,
  latestWorkItemEvent,
}) => {
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow h={"55%"}>
        <DashboardWidget
          w={1}
          name="pr-pull-req-detailed"
          render={({view}) => (
            <ProjectPullRequestsWidget
              instanceKey={instanceKey}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow
        h={"33%"}
        title={`Review Request Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={getTrendsControlBarControls([
          [daysRange, setDaysRange],
          [measurementWindowRange, setMeasurementWindowRange],
          [frequencyRange, setFrequencyRange],
        ])}
      >
        <DashboardWidget
          w={1 / 2}
          name="pr-metrics-summary-detailed"
          render={({view}) => (
            <PullRequestsCompletedTrendsWidget
              instanceKey={instanceKey}
              view={view}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
              latestCommit={latestCommit}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={1 / 2}
          name="pr-metrics-reviewtime-detailed"
          render={({view}) => (
            <PullRequestsReviewTimeTrendsWidget
              instanceKey={instanceKey}
              view={view}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
              latestCommit={latestCommit}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
