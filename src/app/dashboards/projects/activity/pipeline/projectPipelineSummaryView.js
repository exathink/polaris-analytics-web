import React from 'react';
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Statistic} from "../../../../../app/components/misc/statistic/statistic";
import {
  CycleTimeCarousel,
  DurationCarousel,
  EffortCarousel,
  LeadTimeCarousel,
  LatencyCarousel,
  WipCarousel
} from "../../../shared/components/flowStatistics/flowStatistics";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

const PipelineSummaryView = withViewerContext((
  {
    pipelineCycleMetrics,
    specsOnly,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    viewerContext
  }
) => {
  const {workItemsWithCommits, workItemsInScope} = pipelineCycleMetrics;
  const flowboard20 = viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20)
  return (
    <div>
      <VizRow h={"50%"}>
        <VizItem w={flowboard20 ? 0.3 : 0.4}>
          <WipCarousel
            currentMeasurement={pipelineCycleMetrics}
            specsOnly={specsOnly}
          />
        </VizItem>
        <VizItem w={flowboard20 ? 0.3 : 0.6}>
          <CycleTimeCarousel
            currentMeasurement={pipelineCycleMetrics}
            targetPercentile={cycleTimeTargetPercentile || targetPercentile}
            target={cycleTimeTarget}
          />
        </VizItem>
        {
          flowboard20 &&
          <VizItem w={0.3}>
            <LeadTimeCarousel
              currentMeasurement={pipelineCycleMetrics}
              targetPercentile={leadTimeTargetPercentile || targetPercentile}
              target={leadTimeTarget}
            />
          </VizItem>
        }
      </VizRow>
      {
        flowboard20 &&
        <VizRow h={"50%"} style={{
          marginTop: '10px',
          borderTopWidth: '1px',
          borderTopStyle: 'solid',
          borderTopColor: 'rgba(0,0,0,0.1)'
        }}>
          <VizItem w={0.3}>
            <EffortCarousel
              currentMeasurement={pipelineCycleMetrics}
              targetPercentile={cycleTimeTargetPercentile || targetPercentile}
            />
          </VizItem>
          <VizItem w={0.3}>
            <DurationCarousel
              currentMeasurement={pipelineCycleMetrics}
              targetPercentile={cycleTimeTargetPercentile || targetPercentile}
            />
          </VizItem>
          <VizItem w={0.3}>
            <LatencyCarousel
              currentMeasurement={pipelineCycleMetrics}
              targetPercentile={cycleTimeTargetPercentile || targetPercentile}
            />
          </VizItem>
        </VizRow>
      }
    </div>
  )
});

export const ProjectPipelineSummaryView = withNavigationContext(PipelineSummaryView);





