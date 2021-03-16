import React from "react";
import {WorkItemsEpicEffortChart} from "../../../../shared/charts/workItemCharts/workItemsEpicEffortChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {ProjectImplementationCostDetailDashboard} from "./projectImplementationCostDetailDashboard";

export const ProjectImplementationCostView = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  workItems,
  specsOnly,
  days,
  activeOnly,
  title,
  subtitle,
  context,
  view,
  showHierarchy,
}) => {
  if (view === "detail") {
    const props = {instanceKey, latestWorkItemEvent, latestCommit, activeOnly, days, view, context};
    return <ProjectImplementationCostDetailDashboard {...props} />;
  }

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
          context={context}
        />
      </VizItem>
    </VizRow>
  );
};
