import React from 'react';
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";
import {DimensionCycleTimeLatencyView} from "./dimensionCycleTimeLatencyView";
import {getReferenceString, useTablePaginationFeatureFlag} from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {DimensionCycleTimeLatencyDetailView} from "./dimensionCycleTimeLatencyDetailView";
import {DEFAULT_PAGE_SIZE} from "../../../../../../components/tables/tableUtils";


export const DimensionPipelineCycleTimeLatencyWidget = (
  {
    dimension,
    instanceKey,
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



  const {loading, error, data, fetchMore} = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
    first: useTablePaginationFeatureFlag() ? DEFAULT_PAGE_SIZE : null,
    after: null
  })
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('DimensionPipelineCycleTimeLatencyWidget.pipelineStateDetails', error);
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
        // stateTypes={stateTypes}
        stageName={stageName}
        groupByState={groupByState}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        tooltipType={tooltipType}
        view={view}
        context={context}
        fetchMore={fetchMore}
      />
    );
  } else {
    return (
      <DimensionCycleTimeLatencyView
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

DimensionPipelineCycleTimeLatencyWidget.infoConfig = {
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