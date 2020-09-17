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
    specsOnly,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    viewerContext
  }
) => {
  const {workItemsWithCommits, workItemsInScope} = pipelineCycleMetrics;
  const flowboard20 = viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20)
  return (
    <div>
      <VizRow h={"50%"}>
        <VizItem w={flowboard20? 0.3 : 0.5}>
          <Statistic
            title={'Wip'}
            value={specsOnly ? `${workItemsWithCommits}` : `${workItemsInScope}` || 0}
            precision={0}
            valueStyle={{color: '#3f8600'}}

            suffix={specsOnly ? 'Specs' : 'Items'}
          />
        </VizItem>
        <VizItem w={flowboard20? 0.3: 0.5}>
          <AvgCycleTime
            currentCycleMetrics={pipelineCycleMetrics}
          />
        </VizItem>
        {
          flowboard20 &&
            <VizItem w={0.3}>
              <PercentileLeadTime
                currentCycleMetrics={pipelineCycleMetrics}
                targetPercentile={leadTimeTargetPercentile}
              />
            </VizItem>
        }
      </VizRow>
      {
         flowboard20 &&
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
                  targetPercentile={cycleTimeTargetPercentile}
                />
              </VizItem>
            </VizRow>
      }
    </div>
  )
});

export const ProjectPipelineSummaryView = withNavigationContext(PipelineSummaryView);





