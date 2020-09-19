import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";

import {
  AvgDuration,
  CycleTimeCarousel,
  LeadTimeCarousel,
  PercentileDuration,
  Throughput,
  TotalEffort
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
    currentCycleMetrics,
    previousCycleMetrics,
    stateMappingIndex,
    viewerContext
  }
  ) => {
    const trendIndicatorThreshold = viewerContext.trendIndicatorThreshold;

    return (
      stateMappingIndex.isValid() ?
        <div>
          {
            !showAll ?
              <VizRow h={"50%"}>
                <VizItem w={0.30}>
                  <Throughput
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                    specsOnly={specsOnly}
                  />
                </VizItem>
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem w={0.35}>
                    <CycleTimeCarousel
                      currentCycleMetrics={currentCycleMetrics}
                      previousCycleMetrics={previousCycleMetrics}
                      targetPercentile={cycleTimeTargetPercentile || targetPercentile}
                      target={cycleTimeTarget}
                      deltaThreshold={trendIndicatorThreshold}
                    />
                  </VizItem>
                }
                <VizItem w={0.40}>
                  <LeadTimeCarousel
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={leadTimeTargetPercentile || targetPercentile}
                    target={leadTimeTarget}
                  />
                </VizItem>
              </VizRow>
              :
              <VizRow h={"80%"}>
                <VizItem>
                  <Throughput
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                    specsOnly={specsOnly}
                  />
                </VizItem>
                <VizItem>
                  <LeadTimeCarousel
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={leadTimeTargetPercentile || targetPercentile}
                    target={leadTimeTarget}
                  />
                </VizItem>

                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                    <VizItem>
                      <CycleTimeCarousel
                        currentCycleMetrics={currentCycleMetrics}
                        previousCycleMetrics={previousCycleMetrics}
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
              <VizRow h={"50%"}>
                <VizItem w={0.30}>
                  <TotalEffort
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
                <VizItem w={0.35}>
                  <AvgDuration
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}

                  />
                </VizItem>
                <VizItem w={0.40}>
                  <PercentileDuration
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={cycleTimeTargetPercentile}

                  />
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