import React from "react";
import {VizItem, VizRow} from "../../../containers/layout";
import {PullRequestAgeChart} from "./pullRequestAgeChart";
import {navigateToExternalURL} from "../../../navigation/navigate";
import {TrendIndicator} from "../../../../../components/misc/statistic/statistic";
import {FlowStatistic} from "../../../components/flowStatistics/flowStatistics";
import {average} from "../../../../../helpers/utility";
import WorkItems from "../../../../work_items/context";

const OpenPullRequestsStatsView = ({title, pullRequests, view}) => (
  <VizRow h={1}>
    <VizItem w={1 / 2}>
      <FlowStatistic
        title={title || <span>{"Open"}</span>}
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

const PullRequestChartView = ({pullRequests, view, context}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <PullRequestAgeChart
        pullRequests={pullRequests}
        title={pullRequests.length === 1 ? "Open Code Review" : "Open Code Reviews"}
        view={view}
        onSelectionChange={(pullRequests) => {
          if (pullRequests.length === 1) {
            const pullRequest = pullRequests[0];
            if (pullRequest.workItemsSummaries.length === 1) {
              const workItem = pullRequest.workItemsSummaries[0];
              context.navigate(WorkItems, workItem.displayId, workItem.key);
            } else {
              navigateToExternalURL(pullRequests[0].webUrl);
            }
          }
        }}
      />
    </VizItem>
  </VizRow>
);


export const OpenPullRequestsView = ({pullRequests, view, context, asStatistic}) => {
  if (asStatistic) {
    return <OpenPullRequestsStatsView pullRequests={pullRequests} view={view} />;
  }

  return <PullRequestChartView pullRequests={pullRequests} view={view} context={context} />;
};
