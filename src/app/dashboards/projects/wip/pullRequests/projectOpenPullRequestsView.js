import React from "react";
import { VizItem, VizRow } from "../../../shared/containers/layout";
import { WorkItemScopeSelector } from "../../shared/components/workItemScopeSelector";
import { PullRequestAgeChart } from "./pullRequestAgeChart";
import { Flex } from "reflexbox";
import { navigateToPullRequest } from "../../../shared/navigation/navigate";

export const ProjectOpenPullRequestsView = ({
  pullRequests,

  view,
}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <PullRequestAgeChart
        pullRequests={pullRequests}
        title={"Pending Code Reviews"}
        view={view}
        onSelectionChange={(pullRequests) => {
          if (pullRequests.length === 1) {
            navigateToPullRequest(pullRequests[0].webUrl)
          }
        }}
      />
    </VizItem>
  </VizRow>
);
