import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectFunnelCounts} from "../../hooks/useQueryProjectFunnelCounts";
import {ProjectPipelineFunnelView} from "./projectPipelineFunnelView";
import {buildIndex, getLatest} from "../../../../../helpers/utility";
import {ProjectPipelineFunnelDetailDashboard} from "./projectPipelineFunnelDetailDashboard";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {PipelineFunnelWidgetInfoConfig} from "../../../../../components/misc/info";
import { Quadrants, getQuadrant } from "../../../../shared/widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { getWorkItemDurations } from "../../../../shared/widgets/work_items/clientSideFlowMetrics";
import { useWipData, useWipQuery } from "../../../../../helpers/hooksUtil";
import { useProjectContext } from "../../../projectDashboard";

export const ProjectPipelineFunnelWidget = ({
  instanceKey,
  tags,
  release,
  latestWorkItemEvent,
  latestCommit,
  workItemScope,
  setWorkItemScope,
  days,
  showVolumeOrEffort,
  view,
  context,
  pollInterval,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  leadTimeTarget,
  cycleTimeTarget,
  latencyTarget,
  includeSubTasks: {includeSubTasksInClosedState, includeSubTasksInNonClosedState},
  displayBag,
  excludeMotionless
}) => {
  const includeSubTasks = {includeSubTasksInClosedState, includeSubTasksInNonClosedState}
  const queryVars = {
    instanceKey,
    tags,
    release,
    closedWithinDays: days,
    specsOnly: workItemScope === "specs",
    includeSubTasks,
    referenceString: getLatest(latestWorkItemEvent, latestCommit),
  };

  const {loading, error, data} = useQueryProjectFunnelCounts(queryVars);

  const {loading: loading1, error: error1, data: dataAll} = useQueryProjectFunnelCounts({...queryVars, specsOnly: false});

  const {project: dimensionSettings} = useProjectContext();
  const {loading: loading2, error: error2, data: wipDataAll} = useWipQuery({dimensionSettings});
  const {wipWorkItems} = useWipData({wipDataAll, specsOnly: workItemScope === "specs", dimension: "project"});

  if (loading || loading1 || loading2) return <Loading />;
  if (error) {
    logGraphQlError("useQueryProjectPipelineSummary", error);
    return null;
  }
  if (error1) {
    logGraphQlError("useQueryProjectPipelineSummary", error1);
    return null;
  }
  if (error2) {
    logGraphQlError("useQueryDimensionPipelineStateDetails", error2);
    return null;
  }

  let {workItemStateTypeCounts, totalEffortByStateType} = data["project"];
  workItemStateTypeCounts = {...workItemStateTypeCounts, backlog: dataAll["project"].workItemStateTypeCounts.backlog};
  if (excludeMotionless) {
    const nonMotionlessWorkItemDurations = getWorkItemDurations(wipWorkItems).filter(
      (w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) !== Quadrants.abandoned
    );
    const nonMotionlessWorkItemsByState = buildIndex(nonMotionlessWorkItemDurations, (workItem) => workItem.stateType);

    workItemStateTypeCounts = {
      ...workItemStateTypeCounts,
      open: nonMotionlessWorkItemsByState?.["open"]?.length,
      wip: nonMotionlessWorkItemsByState?.["wip"]?.length,
      complete: nonMotionlessWorkItemsByState?.["complete"]?.length,
    };
  }

  return view === "primary" ? (
    <ProjectPipelineFunnelView
      context={context}
      days={days}
      workItemStateTypeCounts={workItemStateTypeCounts}
      totalEffortByStateType={totalEffortByStateType}
      workItemScope={workItemScope}
      setWorkItemScope={setWorkItemScope}
      showVolumeOrEffort={showVolumeOrEffort}
      leadTimeTarget={leadTimeTarget}
      cycleTimeTarget={cycleTimeTarget}
      view={view}
      displayBag={displayBag}
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

ProjectPipelineFunnelWidget.infoConfig = PipelineFunnelWidgetInfoConfig;