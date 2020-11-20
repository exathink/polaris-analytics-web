import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemEventsTimelineChart} from './workItemEventTimelineChart'
import Commits from '../../../commits/context'
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
        context.navigate(Commits, workItemEvent.event.name, workItemEvent.event.key);
      }
      if (workItemEvent.event.type === "pullRequest") {
        window.open(workItemEvent.event.webUrl, "_blank");
      }
    }
  }

  return (
    <VizRow h={1}>
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

