import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";


import {
  AvgCycleTime,
  AvgLeadTime,
  MaxCycleTime,
  MaxLeadTime,
  PercentileCycleTime,
  PercentileLeadTime,
  Throughput
} from "../../../shared/components/flowStatistics/flowStatistics";

export const ProjectAggregateFlowMetricsView = withViewerContext((
  {
    showAll,
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
        <React.Fragment>
          {
            !showAll ?
              <VizRow h={"80%"}>
                <VizItem w={0.30}>
                  <Throughput
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
                <VizItem w={0.40}>
                  <PercentileLeadTime
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    targetPercentile={targetPercentile}
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
                <VizItem w={0.35}>
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
              </VizRow>
              :
              <VizRow h={"80%"}>
                <VizItem>
                  <Throughput
                    currentCycleMetrics={currentCycleMetrics}
                    previousCycleMetrics={previousCycleMetrics}
                    deltaThreshold={trendIndicatorThreshold}
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
        </React.Fragment>
        :
        null
    )
  }
);