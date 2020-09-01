import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";
import {
  AvgCycleTime,
  AvgDuration,
  PercentileDuration,
  PercentileLeadTime,
  TotalEffort
} from "../../../shared/components/flowStatistics/flowStatistics";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

const PipelineSummaryView = withViewerContext((
  {
    pipelineCycleMetrics,
    targetPercentile,
    viewerContext
  }
) => {
  const {workItemsWithCommits} = pipelineCycleMetrics;
  return (
    <div>
      <VizRow h={"50%"}>
        <VizItem w={0.3}>
          <Statistic
            title={'Wip'}
            value={`${workItemsWithCommits}` || 0}
            precision={0}
            valueStyle={{color: '#3f8600'}}

            suffix={"Specs"}
          />
        </VizItem>
        <VizItem w={0.3}>
          <AvgCycleTime
            currentCycleMetrics={pipelineCycleMetrics}
            targetPercentile={targetPercentile}
          />
        </VizItem>
        <VizItem w={0.3}>
          <PercentileLeadTime
            currentCycleMetrics={pipelineCycleMetrics}
            targetPercentile={targetPercentile}
          />
        </VizItem>
      </VizRow>
      {
        viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20) &&
          <VizRow h={"50%"}>
            <VizItem w={0.3}>
              <TotalEffort
                currentCycleMetrics={pipelineCycleMetrics}
              />
            </VizItem>
            <VizItem w={0.3}>
              <AvgDuration
                currentCycleMetrics={pipelineCycleMetrics}
              />
            </VizItem>
            <VizItem w={0.3}>
              <PercentileDuration
                currentCycleMetrics={pipelineCycleMetrics}
                targetPercentile={targetPercentile}
              />
            </VizItem>
          </VizRow>
      }
    </div>
  )
});

export const ProjectPipelineSummaryView = withNavigationContext(PipelineSummaryView);





