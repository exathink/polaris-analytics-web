import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {PipelineStateDistributionChart} from "./pipelineStateDistributionChart";

const PipelineStateDetailsView = ({
  workItems
}) => (
  <PipelineStateDistributionChart
    workItems={workItems}
  />
);


export const ProjectPipelineStateDetailsView = withNavigationContext(PipelineStateDetailsView);

