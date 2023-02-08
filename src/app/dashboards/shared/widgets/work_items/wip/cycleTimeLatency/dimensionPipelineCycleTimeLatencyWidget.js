import React from "react";
import {WidgetCore} from "../../../../../../framework/viz/dashboard/widgetCore";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";
import {DimensionCycleTimeLatencyDetailView} from "./dimensionCycleTimeLatencyDetailView";
import {DimensionCycleTimeLatencyView} from "./dimensionCycleTimeLatencyView";

export const DimensionPipelineCycleTimeLatencyWidget = ({
  queryVars,
  view,
  stageName,
  workItemScope,
  setWorkItemScope,
  stateTypes,
  cycleTimeTarget,
  latencyTarget,
  tooltipType,
  groupByState,
  context,
  displayBag
}) => {
  const result = useQueryDimensionPipelineStateDetails(queryVars);
  const {dimension} = queryVars;

  return (
    <WidgetCore result={result} errorContext="DimensionPipelineCycleTimeLatencyWidget.pipelineStateDetails">
      {view === "primary" && (
        <DimensionCycleTimeLatencyView
          dimension={dimension}
          stageName={stageName}
          workItemScope={workItemScope}
          setWorkItemScope={setWorkItemScope}
          stateTypes={stateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          tooltipType={tooltipType}
          view={view}
          context={context}
          displayBag={displayBag}
        />
      )}

      {view === "detail" && (
        <DimensionCycleTimeLatencyDetailView
          dimension={dimension}
          workItemScope={workItemScope}
          setWorkItemScope={setWorkItemScope}
          // stateTypes={stateTypes}
          stageName={stageName}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          tooltipType={tooltipType}
          view={view}
          context={context}
        />
      )}
    </WidgetCore>
  );
};

DimensionPipelineCycleTimeLatencyWidget.infoConfig = {
  title: "Coding",
  content: () => (
    <>
      <p> short description </p>
    </>
  ),
  content1: () => (
    <>
      <p>Detailed Description</p>
    </>
  ),
};
