import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {PipelineStateDistributionChart} from "../../../projects/activity/pipeline/pipelineStateDistributionChart";

export const WorkItemDurationDetailsView = (
  {
    workItem,
    view
  }
) => (

    <VizRow h={1}>
      <VizItem w={1}>
        <PipelineStateDistributionChart
          workItems={[workItem]}
          stateType={workItem.stateType}
          groupBy={'state'}
          title={'Time spent by phase'}
          shortTooltip={true}
        />
      </VizItem>
    </VizRow>

)

