import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemEventsTimelineChart} from './workItemEventTimelineChart'
import {navigateToExternalURL} from "../../../shared/navigation/navigate";
import {getCommitBrowseUrl} from "../../../shared/helpers/commitUtils";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";

export const WorkItemEventTimelineView = withNavigationContext((
  {
    workItem,
    view,
    context,
    fullScreen
  }
) => {

  function handlePointClick(workItemEvents) {
    const workItemEvent = workItemEvents.length === 1 ? workItemEvents[0] : null;
    if (workItemEvent != null) {
      if (workItemEvent.event.type === "commit") {
        const {repositoryUrl, integrationType, commitHash} = workItemEvent.event;
        if (repositoryUrl && commitHash) {
          const [commitBrowseUrl] = getCommitBrowseUrl(repositoryUrl, integrationType, commitHash);
          navigateToExternalURL(commitBrowseUrl);
        }
      }
      if (workItemEvent.event.type === "pullRequest") {
        navigateToExternalURL(workItemEvent.event.webUrl)
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
          fullScreen={fullScreen}
        />
      </VizItem>
    </VizRow>
  );

})

