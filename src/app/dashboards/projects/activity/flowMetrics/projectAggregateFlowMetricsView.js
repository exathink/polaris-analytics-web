import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";

import {
  CycleTimeCarousel,
  DurationCarousel,
  EffortCarousel,
  LeadTimeCarousel,
  ThroughputCarousel
} from "../../../shared/components/flowStatistics/flowStatistics";

export const ProjectAggregateFlowMetricsView = withViewerContext((
  {
    showAll,
    specsOnly,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    cycleMetricsTrends,

    stateMappingIndex,
    viewerContext
  }
  ) => {
    const trendIndicatorThreshold = viewerContext.trendIndicatorThreshold;
    const [current, previous] = cycleMetricsTrends;

    return (
      stateMappingIndex.isValid() ?
        <div>
          {
            !showAll ?
              <VizRow h={"50%"}>
                <VizItem w={0.30}>
                  <ThroughputCarousel
                    currentCycleMetrics={current}
                    previousCycleMetrics={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    specsOnly={specsOnly}
                  />
                </VizItem>
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem w={0.35}>
                    <CycleTimeCarousel
                      currentCycleMetrics={current}
                      previousCycleMetrics={previous}
                      targetPercentile={cycleTimeTargetPercentile || targetPercentile}
                      target={cycleTimeTarget}
                      deltaThreshold={trendIndicatorThreshold}
                    />
                  </VizItem>
                }
                <VizItem w={0.40}>
                  <LeadTimeCarousel
                    currentCycleMetrics={current}
                    previousCycleMetrics={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={leadTimeTargetPercentile || targetPercentile}
                    target={leadTimeTarget}
                  />
                </VizItem>
              </VizRow>
              :
              <VizRow h={"80%"}>
                <VizItem>
                  <ThroughputCarousel
                    currentCycleMetrics={current}
                    previousCycleMetrics={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    specsOnly={specsOnly}
                  />
                </VizItem>
                <VizItem>
                  <LeadTimeCarousel
                    currentCycleMetrics={current}
                    previousCycleMetrics={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={leadTimeTargetPercentile || targetPercentile}
                    target={leadTimeTarget}
                  />
                </VizItem>

                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem>
                    <CycleTimeCarousel
                      currentCycleMetrics={current}
                      previousCycleMetrics={previous}
                      deltaThreshold={trendIndicatorThreshold}
                      targetPercentile={leadTimeTargetPercentile || targetPercentile}
                      target={leadTimeTarget}
                    />
                  </VizItem>
                }
              </VizRow>

          }
          {
            viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20) && !showAll ?

              <VizRow h={"50%"}
                      style={{borderTopWidth: '1px', borderTopStyle: 'solid', borderTopColor: 'rgba(0,0,0,0.1)'}}>
                <VizItem w={0.3}>
                  <EffortCarousel
                    currentCycleMetrics={current}
                    previousCycleMetrics={previous}
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
                <VizItem w={0.35}>
                  <DurationCarousel
                    currentCycleMetrics={current}
                    previousCycleMetrics={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={cycleTimeTargetPercentile}
                  />
                </VizItem>
                <VizItem w={0.4}>

                </VizItem>

              </VizRow>

              :
              null
          }
        </div>
        :
        null
    )
  }
);