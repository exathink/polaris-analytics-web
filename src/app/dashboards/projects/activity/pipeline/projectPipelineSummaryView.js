import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";
import {AvgCycleTime} from "../../../shared/components/flowStatistics/flowStatistics";

const PipelineSummaryView = (
  {
    pipelineCycleMetrics,
    targetPercentile
  }
) => {
  const {workItemsInScope, workItemsWithCommits} = pipelineCycleMetrics;
  return (
    <VizRow h={"80%"}>
      <VizItem w={0.5}>
        <Statistic
          title={'Wip'}
          value={`${workItemsWithCommits}/${workItemsInScope}` || 0}
          precision={0}
          valueStyle={{color: '#3f8600'}}

          suffix={"Specs"}
        />
      </VizItem>
      <VizItem w={0.5}>
        <AvgCycleTime
          currentCycleMetrics={pipelineCycleMetrics}
          targetPercentile={targetPercentile}
        />
      </VizItem>
    </VizRow>
  )
};

export const ProjectPipelineSummaryView = withNavigationContext(PipelineSummaryView);





