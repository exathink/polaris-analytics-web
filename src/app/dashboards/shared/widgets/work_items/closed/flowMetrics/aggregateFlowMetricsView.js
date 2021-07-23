import React from "react";
import {VizItem, VizRow} from "../../../../containers/layout";
import {withViewerContext} from "../../../../../../framework/viewer/viewerContext";
import styles from "./flowMetrics.module.css";

import {
  AvgCycleTime,
  AvgDuration,
  AvgEffort,
  AvgLatency,
  AvgLeadTime,
  Cadence,
  DurationCarousel,
  EffortCarousel,
  EffortOUT,
  LatencyCarousel,
  LatestClosed,
  Volume,
  VolumeCarousel,
} from "../../../../components/flowStatistics/flowStatistics";
import {ComponentCarousel} from "../../../../components/componentCarousel/componentCarousel";
import {metricsMapping} from "../../../../helpers/teamUtils";
import {useSelectWithDelegate} from "../../../../../../helpers/hooksUtil";

export const PerformanceSummaryView = ({
  cycleMetricsTrends,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  specsOnly,
}) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <React.Fragment>
      <VizItem w={0.2}>
        <Volume currentMeasurement={current} previousMeasurement={previous} specsOnly={specsOnly} />
      </VizItem>
      <VizItem w={0.25}>
        <EffortOUT currentMeasurement={current} previousMeasurement={previous} />
      </VizItem>
      <VizItem w={0.25}>
        <ComponentCarousel tickInterval={3000}>
          <LatestClosed currentMeasurement={current} />
          <Cadence currentMeasurement={current} previousMeasurement={previous} />
        </ComponentCarousel>
      </VizItem>
      <VizItem w={0.3}>
        <ComponentCarousel tickInterval={3000}>
          <AvgCycleTime currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          <AvgDuration currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          <AvgLatency currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
        </ComponentCarousel>
      </VizItem>
    </React.Fragment>
  );
};


export const CadenceDetailView = (
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <div className={styles.throughputDetailWrapper}>

      <div className={styles.effortOut}>
        <Cadence
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
        />
      </div>
      <div className={styles.volume}>

        <LatestClosed
          asCard={true}
          currentMeasurement={current}
        />
      </div>
    </div>
  )
};

export const ThroughputSummaryView = (
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <React.Fragment>
        <VizItem w={1/3}>
          <Volume
            currentMeasurement={current}
            previousMeasurement={previous}
            specsOnly={specsOnly}
          />
        </VizItem>

        <VizItem w={1/3}>
          <EffortOUT
            currentMeasurement={current}
            previousMeasurement={previous}
            specsOnly={specsOnly}
          />
        </VizItem>

        <VizItem w={1/3}>
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
    </React.Fragment>
  )
};

export const ResponseTimeSummaryView = (
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <React.Fragment>
        <VizItem w={1/3}>
        <AvgCycleTime
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}

        />
        </VizItem>
        <VizItem w={1/3}>
        <AvgDuration
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}

        />
        </VizItem>
        <VizItem w={1/3}>
        <AvgLatency
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}

        />
        </VizItem>
    </React.Fragment>
  )
};

export const LeadAndCycleTimeSummaryView = (
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <React.Fragment>
        <VizItem w={1/3}>
          <AvgLeadTime
            currentMeasurement={current}
            previousMeasurement={previous}
            target={leadTimeTarget}
          />
        </VizItem>
        <VizItem w={1/2}>
          <AvgCycleTime
            currentMeasurement={current}
            previousMeasurement={previous}
            target={cycleTimeTarget}

          />
        </VizItem>

    </React.Fragment>
  )
};

export const ValueBoardSummaryView = (
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <div >
      <VizRow h={"50"}>
        <VizItem w={1/3}>
          <Volume

            currentMeasurement={current}
            previousMeasurement={previous}
            specsOnly={specsOnly}
          />
        </VizItem>
        <VizItem w={1/3}>
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
        <VizItem w={1/3}>
          <AvgCycleTime
            currentMeasurement={current}
            previousMeasurement={previous}
            target={cycleTimeTarget}

          />
        </VizItem>
      </VizRow>
      <VizRow h={"50%"}
              style={{
                paddingTop: '20px',
                borderTop: '1px',
                borderTopStyle: 'solid',
                borderTopColor: 'rgba(0,0,0,0.1)'
              }}>
        <VizItem w={1/3}>
          <EffortOUT
            currentMeasurement={current}
            previousMeasurement={previous}
          />
        </VizItem>
        <VizItem w={1/3}>
          <AvgDuration
            currentMeasurement={current}
            previousMeasurement={previous}
            target={cycleTimeTarget}
          />
        </VizItem>
        <VizItem w={1/3}>
          <AvgLatency
            currentMeasurement={current}
            previousMeasurement={previous}
            target={cycleTimeTarget}
          />
        </VizItem>
      </VizRow>
    </div>
  )
};


export const ResponseTimeDetailView = (
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,
    displayProps: {
      initialSelection,
      onSelectionChanged
    }
  }
) => {
  const [selectedMetric, setSelectedMetric] = useSelectWithDelegate(initialSelection, onSelectionChanged);

  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <div className={styles.responseTimeDetailWrapper}>
      <div className={styles.leadTime}>
        <AvgLeadTime
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
          showHighlighted={selectedMetric === metricsMapping.LEAD_TIME}
          onClick={() => setSelectedMetric(metricsMapping.LEAD_TIME)}
        />
      </div>
      <div className={styles.cycleTime}>
        <AvgCycleTime
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
          showHighlighted={selectedMetric === metricsMapping.CYCLE_TIME}
          onClick={() => setSelectedMetric(metricsMapping.CYCLE_TIME)}
        />
      </div>
      <div className={styles.implement}>
        <AvgDuration
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
          showHighlighted={selectedMetric === metricsMapping.DURATION}
          onClick={() => setSelectedMetric(metricsMapping.DURATION)}
        />
      </div>
      <div className={styles.effort}>
        <AvgEffort
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
          showHighlighted={selectedMetric === metricsMapping.EFFORT}
          onClick={() => setSelectedMetric(metricsMapping.EFFORT)}
        />
      </div>
      <div className={styles.deliver}>
        <AvgLatency
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
          showHighlighted={selectedMetric === metricsMapping.LATENCY}
          onClick={() => setSelectedMetric(metricsMapping.LATENCY)}
        />
      </div>
    </div>
  );
};

export const ThroughputDetailView = ({
                                       cycleMetricsTrends,
                                       leadTimeTargetPercentile,
                                       cycleTimeTargetPercentile,
                                       leadTimeTarget,
                                       cycleTimeTarget,
                                       specsOnly,
                                       displayProps: {
                                         initialSelection,
                                         onSelectionChanged
                                       }
                                     }) => {
  const [selectedMetric, setSelectedMetric] = useSelectWithDelegate(initialSelection, onSelectionChanged);

  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  const metric = specsOnly ? "workItemsWithCommits" : "workItemsInScope";
  return (
    <div className={styles.throughputDetailWrapper}>
      <div className={styles.volume}>
        <Volume
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          specsOnly={specsOnly}
          showHighlighted={selectedMetric===metric}
          onClick={() => setSelectedMetric(metric)}
        />
      </div>
      <div className={styles.effortOut}>
        <EffortOUT
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          specsOnly={specsOnly}
          showHighlighted={selectedMetric==="totalEffort"}
          onClick={() => setSelectedMetric("totalEffort")}
        />
      </div>
    </div>
  );
};

export const CycleMetricsCarouselView = (
  {

    cycleMetricsTrends,

    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <React.Fragment>
      <VizItem w={0.30}>
        <VolumeCarousel
          currentMeasurement={current}
          previousMeasurement={previous}
          specsOnly={specsOnly}
        />
      </VizItem>
    </React.Fragment>
  )
};

export const ImplementationMetricsCarouselView = (
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,

  }
) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }

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
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,
    twoRows,

  }
) => {
  const [current, previous] = cycleMetricsTrends;


  if (current == null || previous == null) {
    return null;
  }

  return (
    twoRows ?
      <div>
        <VizRow h={"50"}>
          <CycleMetricsCarouselView
            cycleMetricsTrends={cycleMetricsTrends}

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
            <VolumeCarousel
              currentMeasurement={current}
              previousMeasurement={previous}
              specsOnly={specsOnly}
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
              currentMeasurement={current}
              previousMeasurement={previous}
              targetPercentile={cycleTimeTargetPercentile}
            />
          </VizItem>
        </VizRow>
      </div>
  )
};

export const AggregateFlowMetricsView = withViewerContext((
  {

    cycleMetricsTrends,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    specsOnly,
    display,
    displayProps,
    twoRows,
    latestCommit,
    selectedMetricState
  }
  ) => {


    switch (display) {
      case 'cycleMetricsCarousel':
        return (
          <VizRow h={1}>
            <CycleMetricsCarouselView
              cycleMetricsTrends={cycleMetricsTrends}

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
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
            />
          </VizRow>

        )
      case 'valueBoardSummary':
        return (

            <ValueBoardSummaryView
              cycleMetricsTrends={cycleMetricsTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
            />
        )
      case 'throughputSummary':
        return (
          <VizRow h={1}>
            <ThroughputSummaryView
              cycleMetricsTrends={cycleMetricsTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
              selectedMetricState={selectedMetricState}
            />
          </VizRow>
        )
      case 'responseTimeSummary':
        return (
          <VizRow>
            <ResponseTimeSummaryView
              cycleMetricsTrends={cycleMetricsTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
              selectedMetricState={selectedMetricState}
            />
          </VizRow>
        )
      case 'leadAndCycleTimeSummary':
        return (
          <VizRow>
            <LeadAndCycleTimeSummaryView
              cycleMetricsTrends={cycleMetricsTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
              selectedMetricState={selectedMetricState}
            />
          </VizRow>
        )
      case 'responseTimeDetail':
        return (
            <ResponseTimeDetailView
              cycleMetricsTrends={cycleMetricsTrends}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              leadTimeTargetPercentile={leadTimeTargetPercentile}
              cycleTimeTargetPercentile={cycleTimeTargetPercentile}
              specsOnly={specsOnly}
              twoRows={twoRows}
              displayProps={displayProps}
            />
        )
        case 'throughputDetail':
          return (
              <ThroughputDetailView
                cycleMetricsTrends={cycleMetricsTrends}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeTargetPercentile={leadTimeTargetPercentile}
                cycleTimeTargetPercentile={cycleTimeTargetPercentile}
                specsOnly={specsOnly}
                twoRows={twoRows}
                displayProps={displayProps}
              />
          )
      case 'cadenceDetail':
          return (
              <CadenceDetailView
                cycleMetricsTrends={cycleMetricsTrends}
                leadTimeTarget={leadTimeTarget}
                cycleTimeTarget={cycleTimeTarget}
                leadTimeTargetPercentile={leadTimeTargetPercentile}
                cycleTimeTargetPercentile={cycleTimeTargetPercentile}
                specsOnly={specsOnly}
                twoRows={twoRows}
                displayProps={displayProps}
              />
          )
      case 'all':
        return (
          <AllMetricsDisplayView
            cycleMetricsTrends={cycleMetricsTrends}
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