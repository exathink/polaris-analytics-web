import React from 'react';
import WorkItems from "../../../work_items/context";
import {WorkItemsEpicEffortChart} from "../../../shared/charts/workItemCharts/workItemsEpicEffortChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Flex} from "reflexbox";


export const ProjectImplementationCostView = (
  {
    workItems,
    specsOnly,
    days,
    activeOnly,
    title,
    subtitle,
    view
  }
) => {
  return (
    <div style={{height: "100%"}}>
      <VizRow h={1}>
        <VizItem w={1}>
          <WorkItemsEpicEffortChart
            workItems={workItems}
            specsOnly={specsOnly}
            activeOnly={activeOnly}
            days={days}
            title={title}
            subtitile={subtitle}
            view={view}/>
        </VizItem>
      </VizRow>
    </div>
  )

}