import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {PullRequestsCompletedTrendsWidget} from "../trends/pullRequestsCompleted";
import {PullRequestsReviewTimeTrendsWidget} from "../trends/pullRequestsReviewTime";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../components/trendingControlBar/trendingControlBar";
import {DimensionPullRequestsWidget} from "./dimensionPullRequestsWidget";
import { DimensionResponseTimeWidget } from "../../work_items/responseTime/dimensionResponseTimeWidget";

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
  includeSubTasks
}) => {
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  const [before, setBefore] = React.useState();

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"20%"}
        title={`Pull Request Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={getTrendsControlBarControls([
          [daysRange, setDaysRange],
          [measurementWindowRange, setMeasurementWindowRange],
          [frequencyRange, setFrequencyRange],
        ])}
      >
        <DashboardWidget
          w={1 / 2}
          name="pr-flow-metrics-summary"
          render={({view}) => (
            <DimensionResponseTimeWidget
              dimension={"project"}
              instanceKey={instanceKey}
              view={view}
              display={"pullRequestsFlowMetricsSummary"}
              context={context}
              specsOnly={true}
              days={daysRange}
              measurementWindow={measurementWindowRange}
              samplingFrequency={frequencyRange}
              targetPercentile={responseTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              includeSubTasks={includeSubTasks}
              latestCommit={latestCommit}
              latestWorkItemEvent={latestWorkItemEvent}
            />
          )}
        />
        <DashboardWidget
          w={1 / 2}
          name="pr-open-summary"
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
        <DashboardWidget
          w={1/2}
          name="pr-metrics-review-avg-closed"
          render={({view}) => {
            return (
              <PullRequestsReviewTimeTrendsWidget
                dimension={"project"}
                instanceKey={instanceKey}
                view={view}
                days={daysRange}
                display="reviewTimeAvgPRClosed"
                measurementWindow={measurementWindowRange}
                samplingFrequency={frequencyRange}
                latestCommit={latestCommit}
              />
            );
          }}
         />
      </DashboardRow>
      <DashboardRow h="33%">
        <DashboardWidget
          w={1 / 2}
          name="pr-metrics-summary-detailed"
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
          w={1 / 2}
          name="pr-metrics-reviewtime-detailed"
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
      </DashboardRow>
      <DashboardRow h={"55%"}>
        <DashboardWidget
          w={1}
          name="pr-pull-req-detailed"
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
              display="histogramTable"
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
