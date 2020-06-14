import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemEventsTimelineChart} from './workItemEventTimelineChart'

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

        />
      </VizItem>
    </VizRow>
  );

}

