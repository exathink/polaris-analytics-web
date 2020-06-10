import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemsDurationsByPhaseChart} from "../../../shared/charts/workItemsDurationsByPhaseChart";
import {WorkItemsAggregateDurationsByStateChart} from "../../../shared/charts/workItemsAggregateDurationsByStateChart";

export const WorkItemDurationDetailsView = (
  {
    workItem,
    view
  }
) => (

    <VizRow h={1}>
      <VizItem w={1/2}>
        <WorkItemsDurationsByPhaseChart
          workItems={[workItem]}
          stateType={workItem.stateType}
          groupBy={'state'}
          title={'Time spent by phase'}
          shortTooltip={true}
        />
      </VizItem>
      <VizItem w={1/2}>
        <WorkItemsAggregateDurationsByStateChart
          workItems={[workItem]}
          title={'Time spent by state'}
        />
      </VizItem>
    </VizRow>

)

