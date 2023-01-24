import React from "react";
import {WidgetCore} from "../../../../../../framework/viz/dashboard/widgetCore";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";

export const DimensionPipelineCycleTimeLatencyWidget = ({queryVars, children}) => {
  const result = useQueryDimensionPipelineStateDetails(queryVars);

  return (
    <WidgetCore result={result} errorContext="DimensionPipelineCycleTimeLatencyWidget.pipelineStateDetails">
      {children}
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
