import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {PipelineStateDistributionChart} from "./pipelineStateDistributionChart";

const PipelineStateDetailsView = ({
  workItems,
  projectCycleMetrics
}) => (
  <PipelineStateDistributionChart
    workItems={workItems}
    projectCycleMetrics={projectCycleMetrics}
  />
);


export const ProjectPipelineStateDetailsView = withNavigationContext(PipelineStateDetailsView);

