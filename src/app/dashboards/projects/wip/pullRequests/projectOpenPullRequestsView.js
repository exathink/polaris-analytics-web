import React from "react";
import { VizItem, VizRow } from "../../../shared/containers/layout";
import { WorkItemScopeSelector } from "../../shared/components/workItemScopeSelector";
import { PullRequestAgeChart } from "./pullRequestAgeChart";
import { Flex } from "reflexbox";
import { navigateToPullRequest } from "../../../shared/navigation/navigate";

export const ProjectOpenPullRequestsView = ({
  pullRequests,
  workItemScope,
  setWorkItemScope,
  specsOnly,
  view,
}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      {view === "detail" && (
        <Flex w={1} justify={"center"}>
          <WorkItemScopeSelector
            setWorkItemScope={setWorkItemScope}
            workItemScope={workItemScope}
          />
        </Flex>
      )}
      <PullRequestAgeChart
        pullRequests={pullRequests}
        specsOnly={specsOnly}
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
