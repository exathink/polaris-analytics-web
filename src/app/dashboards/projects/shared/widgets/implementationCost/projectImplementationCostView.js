import React from 'react';
import {WorkItemsEpicEffortChart} from "../../../../shared/charts/workItemCharts/workItemsEpicEffortChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";


export const ProjectImplementationCostView = (
  {
    workItems,
    specsOnly,
    days,
    activeOnly,
    title,
    subtitle,
    view,
    showHierarchy
  }
) => {
  return (

      <VizRow h={1}>
        <VizItem w={1}>
          <WorkItemsEpicEffortChart
            workItems={workItems}
            specsOnly={specsOnly}
            activeOnly={activeOnly}
            days={days}
            title={title}
            subtitle={subtitle}
            view={view}
            showHierarchy={showHierarchy}
          />
        </VizItem>
      </VizRow>

  )

}