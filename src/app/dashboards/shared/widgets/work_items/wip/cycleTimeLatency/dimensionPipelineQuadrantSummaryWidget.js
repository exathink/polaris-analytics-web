import React from 'react';
import {Loading} from "../../../../../../components/graphql/loading";
import {DimensionQuadrantSummaryView} from "./dimensionQuadrantSummaryView";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {DimensionCycleTimeLatencyDetailView} from "./dimensionCycleTimeLatencyDetailView2";
import { useWipQuery } from '../../../../../../helpers/hooksUtil';


export const DimensionPipelineQuadrantSummaryWidget = (
  {
    dimension,
    instanceKey,
    tags,
    release,
    specsOnly,
    workItemScope,
    setWorkItemScope,
    stateTypes,
    latestWorkItemEvent,
    latestCommit,
    days,
    cycleTimeTarget,
    targetPercentile,
    latencyTarget,
    stageName,
    groupByState,
    includeSubTasks,
    tooltipType,
    view,
    context,
    excludeMotionless,
    displayBag
  }
) => {



  const dimensionSettings = {dimension, key: instanceKey, tags, release, latestWorkItemEvent, latestCommit, settingsWithDefaults: {includeSubTasksWipInspector: includeSubTasks}}
  const {loading, error, data: wipDataAll} = useWipQuery({dimensionSettings});

  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('DimensionPipelineQuadrantSummaryWidget.pipelineStateDetails', error);
    return null;
  }



  if (view === "detail") {
    return (
      <DimensionCycleTimeLatencyDetailView
        dimension={dimension}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        specsOnly={specsOnly}
        data={wipDataAll}
        stateTypes={stateTypes}
        stageName={stageName}
        groupByState={groupByState}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        tooltipType={tooltipType}
        view={view}
        context={context}
      />
    );
  } else {
    return (
      <DimensionQuadrantSummaryView
        dimension={dimension}
        stageName={stageName}
        specsOnly={specsOnly}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        wipDataAll={wipDataAll}
        stateTypes={stateTypes}
        groupByState={groupByState}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        tooltipType={tooltipType}
        view={view}
        context={context}
        excludeMotionless={excludeMotionless}
        displayBag={displayBag}
      />
    );
  }
}

DimensionPipelineQuadrantSummaryWidget.infoConfig = {
  title: "Coding",
  content: () => (
    <>
      <p> short description </p>
    </>
  ),
  content1: () => (
    <><p>Detailed Description</p></>
  ),
};