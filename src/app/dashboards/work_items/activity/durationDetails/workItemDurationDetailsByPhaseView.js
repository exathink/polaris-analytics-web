import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemsDurationsByPhaseChart} from "../../../shared/charts/workItemCharts/workItemsDurationsByPhaseChart";

export const WorkItemDurationDetailsByPhaseView = (
  {
    workItem,
    view
  }
) => (

    <VizRow h={160}>
      <VizItem w={1}>
        <WorkItemsDurationsByPhaseChart
          workItems={[workItem]}
          stateType={workItem.stateType}
          groupBy={'state'}
          title={workItem.stateType !== 'closed' ? 'Cycle time by phase' : 'Lead time by phase'}
          singleWorkItemMode={view === 'primary'}
          shortTooltip={true}
        />
      </VizItem>
    </VizRow>

)

