import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {PullRequestsCompletedTrendsWidget} from "../../shared/widgets/pullRequestsCompleted";
import {PullRequestsReviewTimeTrendsWidget} from "../../shared/widgets/pullRequestsReviewTime";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {PullRequestAgeChart} from "./pullRequestAgeChart";
import {navigateToPullRequest} from "../../../shared/navigation/navigate";
import WorkItems from "../../../work_items/context";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../shared/components/trendingControlBar/trendingControlBar";


const dashboard_id = "dashboards.projects.wip.pullrequests.detail";

export const ProjectPullRequestsDetailDashboard = ({
  instanceKey,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
  latestCommit,
  pullRequests
}) => {
  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange],
  ] = useTrendsControlBarState(days, measurementWindow, samplingFrequency);

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"33%"}
        title={`Code Review Trends`}
        subTitle={`Last ${daysRange} days`}
        controls={getTrendsControlBarControls([
          [daysRange, setDaysRange],
          [measurementWindowRange, setMeasurementWindowRange],
          [frequencyRange, setFrequencyRange],
        ])}
      >
        <DashboardWidget
          w={1/2}
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
          w={1/2}
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
      <DashboardRow h={"66%"}>
        <DashboardWidget
          w={1}
          name="pr-pull-req-detailed"
          render={({view}) => (
            <VizRow h={1}>
              <VizItem w={1}>
                <PullRequestAgeChart
                  pullRequests={pullRequests}
                  title={"Pending Code Reviews"}
                  view={view}
                  onSelectionChange={(pullRequests) => {
                    if (pullRequests.length === 1) {
                      const pullRequest = pullRequests[0];
                      if (pullRequest.workItemsSummaries.length === 1) {
                        const workItem = pullRequest.workItemsSummaries[0];
                        context.navigate(WorkItems, workItem.displayId, workItem.key);
                      } else {
                        navigateToPullRequest(pullRequests[0].webUrl);
                      }
                    }
                  }}
                />
              </VizItem>
            </VizRow>
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
