import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";

import {
  AvgCycleTime,
  AvgLeadTime,
  MaxCycleTime,
  MaxLeadTime,
  PercentileCycleTime,
  PercentileLeadTime,
  Throughput,
  TotalEffort,
  AvgDuration, PercentileDuration
} from "../../../shared/components/flowStatistics/flowStatistics";

export const ProjectAggregateFlowMetricsView = withViewerContext((
  {
    showAll,
    specsOnly,
    targetPercentile,
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
                <VizItem w={0.35}>
                  {
                    stateMappingIndex.numInProcessStates() > 0 ?
                      <PercentileCycleTime
                        currentCycleMetrics={currentCycleMetrics}
                        previousCycleMetrics={previousCycleMetrics}
                        targetPercentile={targetPercentile}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                      :
                      <AvgLeadTime
                        currentCycleMetrics={currentCycleMetrics}
                        previousCycleMetrics={previousCycleMetrics}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                  }
                </VizItem>
                <VizItem w={0.40}>
                  <PercentileLeadTime
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    targetPercentile={targetPercentile}
                    deltaThreshold={trendIndicatorThreshold}
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
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem>
                    <AvgLeadTime
                      currentCycleMetrics={currentCycleMetrics}
                      previousCycleMetrics={previousCycleMetrics}
                      deltaThreshold={trendIndicatorThreshold}
                    />
                  </VizItem>
                }
                <VizItem>
                  <PercentileLeadTime
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    targetPercentile={targetPercentile}
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
                <VizItem>
                  <MaxLeadTime
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
                <VizItem>
                  {
                    stateMappingIndex.numInProcessStates() > 0 ?
                      <AvgCycleTime
                        currentCycleMetrics={currentCycleMetrics}
                        previousCycleMetrics={previousCycleMetrics}
                        deltaThreshold={trendIndicatorThreshold}
                      />
                      :
                      <AvgLeadTime
                        currentCycleMetrics={currentCycleMetrics}
                        previousCycleMetrics={previousCycleMetrics}
                        deltaThreshold={trendIndicatorThreshold}
                      />

                  }
                </VizItem>
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem>
                    <PercentileCycleTime
                      currentCycleMetrics={currentCycleMetrics}
                      previousCycleMetrics={previousCycleMetrics}
                      targetPercentile={targetPercentile}
                      deltaThreshold={trendIndicatorThreshold}
                    />
                  </VizItem>
                }
                {
                  stateMappingIndex.numInProcessStates() > 0 &&
                  <VizItem>
                    <MaxCycleTime
                      currentCycleMetrics={currentCycleMetrics}
                      previousCycleMetrics={previousCycleMetrics}
                      deltaThreshold={trendIndicatorThreshold}
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
                    targetPercentile={targetPercentile}
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