import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemsDurationsByPhaseChart} from "../../../shared/charts/workItemsDurationsByPhaseChart";

export const WorkItemDurationDetailsView = (
  {
    workItem,
    view
  }
) => (

    <VizRow h={1}>
      <VizItem w={1}>
        <WorkItemsDurationsByPhaseChart
          workItems={[workItem]}
          stateType={workItem.stateType}
          groupBy={'state'}
          title={'Time spent by phase'}
          shortTooltip={true}
        />
      </VizItem>
    </VizRow>

)

