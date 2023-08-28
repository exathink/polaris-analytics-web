import React from 'react';
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";
import {DimensionQuadrantSummaryView} from "./dimensionQuadrantSummaryView";
import {getReferenceString} from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {DimensionCycleTimeLatencyDetailView} from "./dimensionCycleTimeLatencyDetailView2";


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
    displayBag
  }
) => {



  const {loading, error, data} = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    tags,
    release,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })
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
        data={data}
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
        data={data}
        stateTypes={stateTypes}
        groupByState={groupByState}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        tooltipType={tooltipType}
        view={view}
        context={context}
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