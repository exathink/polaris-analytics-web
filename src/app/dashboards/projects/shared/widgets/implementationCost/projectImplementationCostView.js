import React from "react";
import {WorkItemsEpicEffortChart} from "../../../../shared/charts/workItemCharts/workItemsEpicEffortChart";
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
  );
};
