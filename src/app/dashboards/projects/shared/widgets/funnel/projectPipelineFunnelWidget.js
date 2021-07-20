import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineSummary} from "../../hooks/useQueryProjectPipelineSummary";
import {ProjectPipelineFunnelView} from "./projectPipelineFunnelView";
import {getLatest} from "../../../../../helpers/utility";
import {ProjectPipelineFunnelDetailDashboard} from "./projectPipelineFunnelDetailDashboard";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {INFO_ICON_PLACEMENTS} from "../../../../../framework/viz/dashboard/dashboardWidget";

export const ProjectPipelineFunnelWidget = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  workItemScope,
  setWorkItemScope,
  days,
  view,
  context,
  pollInterval,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  leadTimeTarget,
  cycleTimeTarget,
  includeSubTasks: {includeSubTasksInClosedState, includeSubTasksInNonClosedState}
}) => {
  const includeSubTasks = {includeSubTasksInClosedState, includeSubTasksInNonClosedState}
  const {loading, error, data} = useQueryProjectPipelineSummary({
    instanceKey,
    closedWithinDays: days,
    specsOnly: workItemScope === "specs",
    includeSubTasks,
    referenceString: getLatest(latestWorkItemEvent, latestCommit),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("useQueryProjectPipelineSummary", error);
    return null;
  }
  const {workItemStateTypeCounts, totalEffortByStateType} = data["project"];

  return view === "primary" ? (
    <ProjectPipelineFunnelView
      context={context}
      workItemStateTypeCounts={workItemStateTypeCounts}
      totalEffortByStateType={totalEffortByStateType}
      workItemScope={workItemScope}
      setWorkItemScope={setWorkItemScope}
      view={view}
    />
  ) : (
    <ProjectPipelineFunnelDetailDashboard
      instanceKey={instanceKey}
      context={context}
      latestWorkItemEvent={latestWorkItemEvent}
      latestCommit={latestCommit}
      days={days}
      view={view}
      leadTimeConfidenceTarget={leadTimeConfidenceTarget}
      cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
      leadTimeTarget={leadTimeTarget}
      cycleTimeTarget={cycleTimeTarget}
      includeSubTasks={includeSubTasks}
    />
  );
};

ProjectPipelineFunnelWidget.infoConfig = {
  title: "Funnel Widget",
  content: () => (
    <>
      <p> short description </p>
    </>
  ),
  content1: () => (
    <><p>Funnel Widget Detail Description</p></>
  ),
  placement: INFO_ICON_PLACEMENTS.Right
};