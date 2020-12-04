import React from "react";
import {WorkItemStateTypeMapView} from "./workItemStateTypeMapView";

// get this mapping from api finally
const initialStateTypeMapping = {
  workItemsSourceKey: "46694f4f-e003-4430-a7a7-e4f288f40d22",
  stateMaps: [
    {state: "created", stateType: "unmapped"},
    {state: "Backlog", stateType: "unmapped"},
    {state: "Selected for Development", stateType: "unmapped"},
    {state: "DESIGN", stateType: "unmapped"},
    {state: "READY-FOR-DEVELOPMENT", stateType: "unmapped"},
    {state: "In Progress", stateType: "unmapped"},
    {state: "Code-Review-Needed", stateType: "unmapped"},
    {state: "DEV-DONE", stateType: "unmapped"},
    {state: "ACCEPTED", stateType: "unmapped"},
    {state: "REJECTED", stateType: "unmapped"},
    {state: "Done", stateType: "unmapped"},
    {state: "ABANDONED", stateType: "unmapped"},
    {state: "DEPLOYED-TO-STAGING", stateType: "unmapped"},
    {state: "RELEASED", stateType: "unmapped"},
    {state: "ROADMAP", stateType: "unmapped"},
    {state: "Closed", stateType: "unmapped"},
  ],
  allStateTypes: [
    {key: "unmapped", displayValue: "Unmapped"},
    {key: "backlog", displayValue: "Define"},
    {key: "wip", displayValue: "Build"},
    {key: "complete", displayValue: "Deliver"},
    {key: "open", displayValue: "Open"},
    {key: "closed", displayValue: "Closed"},
  ],
};

export const WorkItemStateTypeMapWidget = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  days,
  view,
  context,
  pollInterval,
}) => {
  return <WorkItemStateTypeMapView initialStateTypeMapping={initialStateTypeMapping} context={context} view={view} />;
};
