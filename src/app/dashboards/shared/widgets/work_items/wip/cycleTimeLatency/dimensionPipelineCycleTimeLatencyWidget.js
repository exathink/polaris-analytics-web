import React from 'react';
import {Loading} from "../../../../../../components/graphql/loading";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";
import {DimensionCycleTimeLatencyView} from "./dimensionCycleTimeLatencyView";
import {getReferenceString} from "../../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {DimensionCycleTimeLatencyDetailView} from "./dimensionCycleTimeLatencyDetailView";


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
  }
) => {



  const {loading, error, data} = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
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
      />
    );
  }
}

DimensionPipelineCycleTimeLatencyWidget.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "Implementation",
  VideoDescription: () => (
    <>
      <h2>Implementation</h2>
      <p> lorem ipsum </p>
    </>
  ),
};