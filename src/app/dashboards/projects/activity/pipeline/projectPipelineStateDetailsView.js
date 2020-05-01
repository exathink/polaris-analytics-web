import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {PipelineStateDistributionChart} from "./pipelineStateDistributionChart";
import {VizRow, VizItem} from "../../../shared/containers/layout";

const PipelineStateDetailsView = ({
  workItems,
  projectCycleMetrics,
  view
}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <PipelineStateDistributionChart
        workItems={workItems}
        projectCycleMetrics={projectCycleMetrics}
      />
    </VizItem>
  </VizRow>
);


export const ProjectPipelineStateDetailsView = withNavigationContext(PipelineStateDetailsView);

