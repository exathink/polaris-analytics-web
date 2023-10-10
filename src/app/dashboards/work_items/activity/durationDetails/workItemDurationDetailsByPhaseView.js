import React from 'react';
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemsDurationsByPhaseChart} from "../../../shared/charts/workItemCharts/workItemsDurationsByPhaseChart";
import { useBlurClass } from '../../../../helpers/utility';

export const WorkItemDurationDetailsByPhaseView = (
  {
    workItem,
    view
  }
) => {
const blurClass = useBlurClass();

return (
  <VizRow h={160}>
    <VizItem w={1}>
      <WorkItemsDurationsByPhaseChart
        workItems={[workItem]}
        stateType={workItem.stateType}
        groupBy={"state"}
        title={workItem.stateType !== "closed" ? "Age by phase" : "Lead time by phase"}
        singleWorkItemMode={view === "primary"}
        shortTooltip={true}
        blurClass={blurClass}
      />
    </VizItem>
  </VizRow>
);

}

