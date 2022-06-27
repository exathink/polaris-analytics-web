import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {PullRequestsCompletedTrendsWidget} from "../trends/pullRequestsCompleted";
import {PullRequestsReviewTimeTrendsWidget} from "../trends/pullRequestsReviewTime";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../components/trendingControlBar/trendingControlBar";
import {DimensionPullRequestsWidget} from "./dimensionPullRequestsWidget";

const dashboard_id = "dashboards.projects.wip.pullrequests.detail";

export const DimensionPullRequestsDetailDashboard = ({
  dimension,
  instanceKey,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
  latestCommit,
  latestPullRequestEvent,
  latestWorkItemEvent,
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  responseTimeConfidenceTarget,
  includeSubTasks,
}) => {
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  const [before, setBefore] = React.useState();

  return (
    <Dashboard
      dashboard={dashboard_id}
      gridLayout={true}
      className="tw-grid tw-grid-cols-6 tw-grid-rows-[8%_20%_38%_33%] tw-gap-x-2 tw-gap-y-1"
    >
      <DashboardRow
        title={`Pull Request Trends`}
        subTitle={`Last ${daysRange} days`}
        className="tw-col-span-6 tw-grid tw-grid-cols-[30%_70%]"
        controls={getTrendsControlBarControls([
          [daysRange, setDaysRange],
          [measurementWindowRange, setMeasurementWindowRange],
          [frequencyRange, setFrequencyRange],
        ])}
      >
        <DashboardWidget
          name="pr-metrics-review-avg-closed"
          className="tw-col-span-3"
          render={({view}) => {
            return (
              <PullRequestsReviewTimeTrendsWidget
                dimension={"project"}
                instanceKey={instanceKey}
                view={view}
                days={daysRange}
                display="reviewTimeAvgPRClosed"
                measurementWindow={daysRange}
                samplingFrequency={daysRange}
                latestCommit={latestCommit}
              />
            );
          }}
        />

        <DashboardWidget
          name="pr-open-summary"
          className="tw-col-span-3"
          render={({view}) => {
            return (
              <DimensionPullRequestsWidget
                dimension={"project"}
                instanceKey={instanceKey}
                view={view}
                context={context}
                latestCommit={latestCommit}
                asCard={true}
                activeOnly={true}
              />
            );
          }}
        />

      </DashboardRow>
      <DashboardRow>

        <DashboardWidget
          name="pr-metrics-summary-detailed"
          className="tw-col-span-2"
          render={({view}) => (
            <PullRequestsCompletedTrendsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              view={view}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
              latestCommit={latestCommit}
              setBefore={setBefore}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pr-metrics-reviewtime-detailed"
          className="tw-col-span-2"
          render={({view}) => (
            <PullRequestsReviewTimeTrendsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              view={view}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
              latestCommit={latestCommit}
              setBefore={setBefore}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          name="pr-pull-req-detailed"
          className="tw-col-span-2"
          render={({view}) => (
            <DimensionPullRequestsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              activeOnly={true}
              display="histogram"
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          name="pr-pull-req-detailed"
          className="tw-col-span-6 tw-h-full"
          render={({view}) => (
            <DimensionPullRequestsWidget
              dimension={dimension}
              instanceKey={instanceKey}
              view={view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              latestPullRequestEvent={latestPullRequestEvent}
              activeOnly={before ? undefined : true}
              before={before}
              setBefore={setBefore}
              closedWithinDays={before ? measurementWindowRange : undefined}
              display="table"
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
