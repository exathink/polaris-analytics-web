import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {PROJECTS_FLOWBOARD_20} from "../../../../../config/featureFlags";

import {
  CycleTimeSLACarousel,
  DurationCarousel,
  EffortCarousel,
  LatencyCarousel,
  LeadTimeSLACarousel,
  ThroughputCarousel
} from "../../../shared/components/flowStatistics/flowStatistics";

export const ProjectAggregateFlowMetricsView = withViewerContext((
  {
    showAll,
    specsOnly,
    
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    cycleMetricsTrends,
    responseTimeConfidenceTrends,
    stateMappingIndex,
    viewerContext
  }
  ) => {
    const trendIndicatorThreshold = viewerContext.trendIndicatorThreshold;
    const [current, previous] = cycleMetricsTrends;
    const [currentConfidence, previousConfidence] = responseTimeConfidenceTrends;
    return (
      stateMappingIndex.isValid() ?
        <div>

          <VizRow h={viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20) ? "50%" : "100%"}>
            <VizItem w={0.30}>
              <ThroughputCarousel
                currentMeasurement={current}
                previousMeasurement={previous}
                deltaThreshold={trendIndicatorThreshold}
                specsOnly={specsOnly}
              />
            </VizItem>
            {
              stateMappingIndex.numInProcessStates() > 0 &&
              <VizItem w={0.35}>
                <CycleTimeSLACarousel
                  currentMeasurement={current}
                  previousMeasurement={previous}
                  currentConfidence={currentConfidence}
                  previousConfidence={previousConfidence}
                  targetPercentile={cycleTimeTargetPercentile}
                  target={cycleTimeTarget}
                  deltaThreshold={trendIndicatorThreshold}
                />
              </VizItem>
            }
            <VizItem w={0.40}>
              <LeadTimeSLACarousel
                currentMeasurement={current}
                previousMeasurement={previous}
                currentConfidence={currentConfidence}
                previousConfidence={previousConfidence}
                deltaThreshold={trendIndicatorThreshold}
                targetPercentile={leadTimeTargetPercentile}
                target={leadTimeTarget}
              />
            </VizItem>
            {
              showAll &&
                <VizItem w={0.45} style={{
                        paddingLeft: '100px',
                        borderLeftWidth: '1px',
                        borderLeftStyle: 'solid',
                        borderLeftColor: 'rgba(0,0,0,0.1)'
                      }}>
                  <EffortCarousel
                    currentMeasurement={current}
                    previousMeasurement={previous}
                    targetPercentile={cycleTimeTargetPercentile }
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
            }
            {
              showAll &&
                <VizItem w={0.35} >
                  <DurationCarousel
                    currentMeasurement={current}
                    previousMeasurement={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={cycleTimeTargetPercentile}
                  />
                </VizItem>
            }
            {
              showAll &&
                <VizItem w={0.4}>
                  <LatencyCarousel
                    currentMeasurement={current}
                    previousMeasurement={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={cycleTimeTargetPercentile}
                  />
                </VizItem>
            }
          </VizRow>

          {
            viewerContext.isFeatureFlagActive(PROJECTS_FLOWBOARD_20) ?

              <VizRow h={"50%"}
                      style={{
                        marginTop: '10px',
                        borderTopWidth: '1px',
                        borderTopStyle: 'solid',
                        borderTopColor: 'rgba(0,0,0,0.1)'
                      }}>
                <VizItem w={0.3}>
                  <EffortCarousel
                    currentMeasurement={current}
                    previousMeasurement={previous}
                    targetPercentile={cycleTimeTargetPercentile }
                    deltaThreshold={trendIndicatorThreshold}
                  />
                </VizItem>
                <VizItem w={0.35}>
                  <DurationCarousel
                    currentMeasurement={current}
                    previousMeasurement={previous}
                    deltaThreshold={trendIndicatorThreshold}
                    targetPercentile={cycleTimeTargetPercentile}
                  />
                </VizItem>
                <VizItem w={0.4}>
                  <LatencyCarousel
                    currentMeasurement={current}
                    previousMeasurement={previous}
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