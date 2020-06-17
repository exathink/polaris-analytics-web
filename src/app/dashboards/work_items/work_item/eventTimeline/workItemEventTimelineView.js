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


  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <WorkItemEventsTimelineChart
          workItem={workItem}
          context={context}
          view={view}
          onSelectionChange={
            (workItemEvents) => {
              if (workItemEvents.length === 1 && workItemEvents[0].event.type === 'commit') {
                context.navigate(Commits, workItemEvents[0].event.name, workItemEvents[0].event.key)
              }
            }
          }
        />
      </VizItem>
    </VizRow>
  );

}

