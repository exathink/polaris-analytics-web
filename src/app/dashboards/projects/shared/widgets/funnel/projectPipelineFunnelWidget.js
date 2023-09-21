import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineSummary} from "../../hooks/useQueryProjectPipelineSummary";
import {ProjectPipelineFunnelView} from "./projectPipelineFunnelView";
import {buildIndex, getLatest, getReferenceString} from "../../../../../helpers/utility";
import {ProjectPipelineFunnelDetailDashboard} from "./projectPipelineFunnelDetailDashboard";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {PipelineFunnelWidgetInfoConfig} from "../../../../../components/misc/info";
import { useQueryDimensionPipelineStateDetails } from "../../../../shared/widgets/work_items/hooks/useQueryDimensionPipelineStateDetails";
import { Quadrants, getQuadrant } from "../../../../shared/widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { getWorkItemDurations } from "../../../../shared/widgets/work_items/clientSideFlowMetrics";

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
  excludeAbandoned
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

  const {loading, error, data} = useQueryProjectPipelineSummary(queryVars);

  const {loading: loading1, error: error1, data: dataAll} = useQueryProjectPipelineSummary({...queryVars, specsOnly: false});

  const {loading: loading2, error: error2, data: wipData} = useQueryDimensionPipelineStateDetails({
    dimension: "project",
    instanceKey,
    tags,
    specsOnly: workItemScope === "specs",
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })

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

  const getWorkItems = () => {
    const edges = wipData?.["project"]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  };

  let {workItemStateTypeCounts, totalEffortByStateType} = data["project"];
  workItemStateTypeCounts = {...workItemStateTypeCounts, backlog: dataAll["project"].workItemStateTypeCounts.backlog};
  if (excludeAbandoned) {
    const nonAbandonedWorkItemDurations = getWorkItemDurations(getWorkItems()).filter(
      (w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) !== Quadrants.abandoned
    );
    const nonAbandonedWorkItemsByState = buildIndex(nonAbandonedWorkItemDurations, (workItem) => workItem.stateType);

    workItemStateTypeCounts = {
      ...workItemStateTypeCounts,
      wip: nonAbandonedWorkItemsByState?.["wip"]?.length,
      complete: nonAbandonedWorkItemsByState?.["complete"]?.length,
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