import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {PullRequestAgeChart} from "./pullRequestAgeChart";
import {navigateToPullRequest} from "../../../shared/navigation/navigate";
import {TrendIndicator} from "../../../../components/misc/statistic/statistic";
import {FlowStatistic} from "../../../shared/components/flowStatistics/flowStatistics";
import {average} from "../../../../helpers/utility";
import WorkItems from "../../../work_items/context";

const ProjectOpenPullRequestsStatsView = ({title, pullRequests, view}) => (
  <VizRow h={1}>
    <VizItem w={1 / 2}>
      <FlowStatistic
        title={title || <span>{"Pending"}</span>}
        currentValue={(pullRequests && pullRequests.length) || 0}
        good={TrendIndicator.isNegative}
      />
    </VizItem>
    <VizItem w={1 / 2}>
      <FlowStatistic
        title={
          title || (
            <span>
              {"Age"}
              <sup> Avg </sup>
            </span>
          )
        }
        currentValue={average(pullRequests, (pullRequest) => pullRequest.age)}
        uom={"Days"}
        precision={1}
        good={TrendIndicator.isNegative}
      />
    </VizItem>
  </VizRow>
);

const ProjectPullRequestChartView = ({pullRequests, view, context}) => (
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
);


export const ProjectOpenPullRequestsView = ({pullRequests, view, asStatistic}) => {
  if (asStatistic) {
    return <ProjectOpenPullRequestsStatsView pullRequests={pullRequests} view={view} />;
  }

  return <ProjectPullRequestChartView pullRequests={pullRequests} view={view} />;
};
