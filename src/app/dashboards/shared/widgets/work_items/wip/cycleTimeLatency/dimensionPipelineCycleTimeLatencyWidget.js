import React from "react";
import {WidgetCore} from "../../../../../../framework/viz/dashboard/widgetCore";
import {DimensionCycleTimeLatencyDetailView} from "./dimensionCycleTimeLatencyDetailView2";
import {DimensionCycleTimeLatencyView} from "./dimensionCycleTimeLatencyView";
import { useWipQuery } from "../../../../../../helpers/hooksUtil";

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
  const dimensionSettings = {...queryVars, settingsWithDefaults: {includeSubTasksWipInspector: queryVars.includeSubTasks}};
  const result = useWipQuery({dimensionSettings})
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
          specsOnly={queryVars.specsOnly}
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
          specsOnly={queryVars.specsOnly}
          displayBag={displayBag}
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
