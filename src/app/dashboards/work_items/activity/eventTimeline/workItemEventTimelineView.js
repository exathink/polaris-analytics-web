import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemEventsTimelineChart} from './workItemEventTimelineChart'
import {navigateToPullRequest, navigateToCommit} from "../../../shared/navigation/navigate";
import {getCommitBrowseUrl} from "../../../shared/helpers/commitUtils";

export const WorkItemEventTimelineView = (
  {
    workItem,
    view,
    context
  }
) => {

  function handlePointClick(workItemEvents) {
    const workItemEvent = workItemEvents.length === 1 ? workItemEvents[0] : null;
    if (workItemEvent != null) {
      if (workItemEvent.event.type === "commit") {
        const {repositoryUrl, integrationType, commitHash} = workItemEvent.event;
        if (repositoryUrl && commitHash) {
          const [commitBrowseUrl] = getCommitBrowseUrl(repositoryUrl, integrationType, commitHash);
          navigateToCommit(commitBrowseUrl);
        }
      }
      if (workItemEvent.event.type === "pullRequest") {
        navigateToPullRequest(workItemEvent.event.webUrl)
      }
    }
  }

  return (
    <VizRow h={160}>
      <VizItem w={1}>
        <WorkItemEventsTimelineChart
          workItem={workItem}
          context={context}
          view={view}
          onSelectionChange={handlePointClick}
        />
      </VizItem>
    </VizRow>
  );

}

