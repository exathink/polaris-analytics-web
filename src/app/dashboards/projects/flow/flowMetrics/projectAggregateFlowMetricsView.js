import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

import {
  AvgCycleTime,
  AvgDuration,
  AvgLatency,
  CycleTimeSLACarousel,
  DurationCarousel,
  EffortCarousel,
  LatencyCarousel,
  LatestClosed,
  Cadence,
  LeadTimeSLACarousel,
  Throughput,
  ThroughputCarousel,
  TotalEffort,
} from "../../../shared/components/flowStatistics/flowStatistics";
import {ComponentCarousel} from "../../../shared/components/componentCarousel/componentCarousel";


export const PerformanceSummaryView = (
  {

    cycleMetricsTrends,
    responseTimeConfidenceTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;

  return (
    <React.Fragment>

      <VizItem w={0.20}>
        <Throughput
          title={'Closed'}
          currentMeasurement={current}
          previousMeasurement={previous}
          specsOnly={specsOnly}
        />
      </VizItem>
      <VizItem w={0.25}>
        <TotalEffort
          currentMeasurement={current}
          previousMeasurement={previous}
        />
      </VizItem>
      <VizItem w={0.25}>
        <ComponentCarousel tickInterval={3000}>
          <LatestClosed
            currentMeasurement={current}
          />
          <Cadence
            currentMeasurement={current}
            previousMeasurement={previous}
            />
        </ComponentCarousel>
      </VizItem>
      <VizItem w={0.30}>
        <ComponentCarousel tickInterval={3000}>
          <AvgCycleTime
            currentMeasurement={current}
            previousMeasurement={previous}
            target={cycleTimeTarget}

          />
          <AvgDuration
            currentMeasurement={current}
            previousMeasurement={previous}
            target={cycleTimeTarget}

          />
          <AvgLatency
            title={'Delivery Latency '}
            currentMeasurement={current}
            previousMeasurement={previous}
            target={cycleTimeTarget}

          />
        </ComponentCarousel>
      </VizItem>
    </React.Fragment>
  )
};

export const CycleMetricsCarouselView = (
  {

    cycleMetricsTrends,
    responseTimeConfidenceTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  const [currentConfidence, previousConfidence] = responseTimeConfidenceTrends;

  return (
    <React.Fragment>
      <VizItem w={0.30}>
        <ThroughputCarousel
          currentMeasurement={current}
          previousMeasurement={previous}
          specsOnly={specsOnly}
        />
      </VizItem>
      <VizItem w={0.35}>
        <CycleTimeSLACarousel
          currentMeasurement={current}
          previousMeasurement={previous}
          currentConfidence={currentConfidence}
          previousConfidence={previousConfidence}
          targetPercentile={cycleTimeTargetPercentile}
          target={cycleTimeTarget}
        />
      </VizItem>
      <VizItem w={0.40}>
        <LeadTimeSLACarousel
          currentMeasurement={current}
          previousMeasurement={previous}
          currentConfidence={currentConfidence}
          previousConfidence={previousConfidence}
          targetPercentile={leadTimeTargetPercentile}
          target={leadTimeTarget}
        />
      </VizItem>
    </React.Fragment>
  )
};

export const ImplementationMetricsCarouselView = (
  {

    cycleMetricsTrends,
    responseTimeConfidenceTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;


  return (
    <React.Fragment>
      <VizItem w={0.30}>
        <EffortCarousel
          currentMeasurement={current}
          previousMeasurement={previous}
          targetPercentile={cycleTimeTargetPercentile}
        />
      </VizItem>
      <VizItem w={0.35}>
        <DurationCarousel
          currentMeasurement={current}
          previousMeasurement={previous}
          targetPercentile={cycleTimeTargetPercentile}
        />
      </VizItem>
      <VizItem w={0.40}>
        <LatencyCarousel
          title={'Delivery Latency'}
          currentMeasurement={current}
          previousMeasurement={previous}
          targetPercentile={cycleTimeTargetPercentile}
        />
      </VizItem>
    </React.Fragment>
  )
};

export const AllMetricsDisplayView = (
  {

    cycleMetricsTrends,
    responseTimeConfidenceTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,
    twoRows,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  const [currentConfidence, previousConfidence] = responseTimeConfidenceTrends;
  return (
    twoRows ?
      <div>
        <VizRow h={"50"}>
          <CycleMetricsCarouselView
            cycleMetricsTrends={cycleMetricsTrends}
            responseTimeConfidenceTrends={responseTimeConfidenceTrends}
            leadTimeTargetPercentile={leadTimeTargetPercentile}
            cycleTimeTargetPercentile={cycleTimeTargetPercentile}
            leadTimeTarget={leadTimeTarget}
            cycleTimeTarget={cycleTimeTarget}
            specsOnly
          />
        </VizRow>
        <VizRow h={"50%"}
                style={{
                  paddingTop: '20px',
                  borderTop: '1px',
                  borderTopStyle: 'solid',
                  borderTopColor: 'rgba(0,0,0,0.1)'
                }}>
          <ImplementationMetricsCarouselView
            cycleMetricsTrends={cycleMetricsTrends}
            responseTimeConfidenceTrends={responseTimeConfidenceTrends}
            leadTimeTargetPercentile={leadTimeTargetPercentile}
            cycleTimeTargetPercentile={cycleTimeTargetPercentile}
            leadTimeTarget={leadTimeTarget}
            cycleTimeTarget={cycleTimeTarget}
            specsOnly
          />
        </VizRow>
      </div>
      :
      <div>
        <VizRow h={"100%"}>
          <VizItem w={0.30}>
            <ThroughputCarousel
              currentMeasurement={current}
              previousMeasurement={previous}
              specsOnly={specsOnly}
            />
          </VizItem>
          <VizItem w={0.35}>
            <CycleTimeSLACarousel
              currentMeasurement={current}
              previousMeasurement={previous}
              currentConfidence={currentConfidence}
              previousConfidence={previousConfidence}
              targetPercentile={cycleTimeTargetPercentile}
              target={cycleTimeTarget}
            />
          </VizItem>
          <VizItem w={0.40}>
            <LeadTimeSLACarousel
              currentMeasurement={current}
              previousMeasurement={previous}
              currentConfidence={currentConfidence}
              previousConfidence={previousConfidence}
              targetPercentile={leadTimeTargetPercentile}
              target={leadTimeTarget}
            />
          </VizItem>
          <VizItem w={0.45} style={{
            paddingLeft: '100px',
            borderLeftWidth: '1px',
            borderLeftStyle: 'solid',
            borderLeftColor: 'rgba(0,0,0,0.1)'
          }}>
            <EffortCarousel
              currentMeasurement={current}
              previousMeasurement={previous}
              targetPercentile={cycleTimeTargetPercentile}
            />
          </VizItem>
          <VizItem w={0.35}>
            <DurationCarousel
              currentMeasurement={current}
              previousMeasurement={previous}
              targetPercentile={cycleTimeTargetPercentile}
            />
          </VizItem>
          <VizItem w={0.4}>
            <LatencyCarousel
              title={'Delivery Latency'}
              currentMeasurement={current}
              previousMeasurement={previous}
              targetPercentile={cycleTimeTargetPercentile}
            />
          </VizItem>
        </VizRow>
      </div>
  )
};

export const ProjectAggregateFlowMetricsView = withViewerContext((
  {

    cycleMetricsTrends,
    responseTimeConfidenceTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,
    display,
    twoRows
  }
  ) => {


    switch (display) {
      case 'cycleMetricsCarousel':
        return (
          <VizRow h={1}>
            <CycleMetricsCarouselView
              cycleMetricsTrends={cycleMetricsTrends}
              responseTimeConfidenceTrends={responseTimeConfidenceTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
            />
          </VizRow>
        )
      case 'implementationMetricsCarousel':
        return (
          <VizRow h={1}>
            <ImplementationMetricsCarouselView
              cycleMetricsTrends={cycleMetricsTrends}
              responseTimeConfidenceTrends={responseTimeConfidenceTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
            />
          </VizRow>
        )
      case 'performanceSummary':
        return (
          <VizRow h={1}>
            <PerformanceSummaryView
              cycleMetricsTrends={cycleMetricsTrends}
              responseTimeConfidenceTrends={responseTimeConfidenceTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
            />
          </VizRow>

        )
      case 'all':
        return (
          <AllMetricsDisplayView
            cycleMetricsTrends={cycleMetricsTrends}
            responseTimeConfidenceTrends={responseTimeConfidenceTrends}
            leadTimeTarget={leadTimeTarget}
            cycleTimeTarget={cycleTimeTarget}
            leadTimeTargetPercentile={leadTimeTargetPercentile}
            cycleTimeTargetPercentile={cycleTimeTargetPercentile}
            specsOnly={specsOnly}
            twoRows={twoRows}
          />
        )
      default:
        return "Error: A valid value for required prop 'display' was not provided"
    }
  }
);