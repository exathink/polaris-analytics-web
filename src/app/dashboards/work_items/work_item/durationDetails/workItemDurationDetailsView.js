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
          title={workItem.stateType !== 'closed' ? 'Cycle time by phase' : 'Lead time by phase'}
          singleWorkItemMode={view === 'primary'}
          shortTooltip={true}
        />
      </VizItem>
      <VizItem w={1/2}>
        <WorkItemsAggregateDurationsByStateChart
          workItems={[workItem]}
          title={workItem.stateType !== 'closed' ? 'Cycle time by state' : 'Lead time by state'}
        />
      </VizItem>
    </VizRow>

)

