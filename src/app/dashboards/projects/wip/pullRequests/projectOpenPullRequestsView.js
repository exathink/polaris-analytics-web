import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {PullRequestAgeChart} from "./pullRequestAgeChart";
import {navigateToPullRequest} from "../../../shared/navigation/navigate";
import {TrendIndicator} from "../../../../components/misc/statistic/statistic";
import {FlowStatistic} from "../../../shared/components/flowStatistics/flowStatistics";
import {average} from "../../../../helpers/utility";

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

export const ProjectOpenPullRequestsView = ({pullRequests, view}) =>
  view === "primary" ? (
    <ProjectOpenPullRequestsStatsView pullRequests={pullRequests} view={view} />
  ) : (
    <VizRow h={1}>
      <VizItem w={1}>
        <PullRequestAgeChart
          pullRequests={pullRequests}
          title={"Pending Code Reviews"}
          view={view}
          onSelectionChange={(pullRequests) => {
            if (pullRequests.length === 1) {
              navigateToPullRequest(pullRequests[0].webUrl);
            }
          }}
        />
      </VizItem>
    </VizRow>
  );
