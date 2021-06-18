import React from "react";
import {WorkItemsEpicEffortChart} from "../../../../shared/charts/workItemCharts/workItemsEpicEffortChart";
import {ImplementationCostDetailWidget} from "./implementationCostDetailWidget";

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
  includeSubTasks,
  workItemScope,
  setWorkItemScope,
  setClosedWithinDays,
}) => {
  if (view === "detail") {
    return (
      <ImplementationCostDetailWidget
        instanceKey={instanceKey}
        context={context}
        view={view}
        closedWithinDays={days}
        latestCommit={latestCommit}
        latestWorkItemEvent={latestWorkItemEvent}
        includeSubTasks={includeSubTasks}
        specsOnly={specsOnly}
        activeOnly={activeOnly}
        epicChartData={workItems}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        setClosedWithinDays={setClosedWithinDays}
      />
    );
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
