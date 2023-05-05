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
  ContributorCount,
  PullRequest

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
          displayType="card"
          currentMeasurement={current}
          previousMeasurement={previous}
        />
      </div>
      <div className={styles.volume}>

        <LatestClosed
          displayType="card"
          currentMeasurement={current}
        />
      </div>
    </div>
  )
};

export const ThroughputSummaryView = (
  {

    contributorCount,
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
      <VizItem w={0.2}>
          <ContributorCount
            contributorCount={contributorCount}
          />
        </VizItem>
        <VizItem w={0.2}>
          <Volume
            currentMeasurement={current}
            previousMeasurement={previous}
            specsOnly={specsOnly}
          />
        </VizItem>

        <VizItem w={0.3}>
          <EffortOUT
            currentMeasurement={current}
            previousMeasurement={previous}
            specsOnly={specsOnly}
          />
        </VizItem>

        <VizItem w={0.3}>
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
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === metricsMapping.LEAD_TIME,
            onClick: () => setSelectedMetric(metricsMapping.LEAD_TIME),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={leadTimeTarget}
        />
      </div>
      <div className={styles.text1}>
        <span className={'tw-textXs tw-grey tw-italic'}>Value Added</span>
      </div>
      <div className={styles.cycleTime}>
        <AvgCycleTime
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === metricsMapping.CYCLE_TIME,
            onClick: () => setSelectedMetric(metricsMapping.CYCLE_TIME),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className={styles.implement}>
        <AvgDuration
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === metricsMapping.DURATION,
            onClick: () => setSelectedMetric(metricsMapping.DURATION),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className={styles.effort}>
        <AvgEffort
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === metricsMapping.EFFORT,
            onClick: () => setSelectedMetric(metricsMapping.EFFORT),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className={styles.text2}>
        <span className={'tw-textXs tw-grey tw-italic'}>Non Value-Added</span>
      </div>
      <div className={styles.pullRequest}>
        <PullRequest
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === metricsMapping.PULLREQUEST,
            onClick: () => setSelectedMetric(metricsMapping.PULLREQUEST),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className={styles.deliver}>
        <AvgLatency
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === metricsMapping.LATENCY,
            onClick: () => setSelectedMetric(metricsMapping.LATENCY),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
    </div>
  );
};

export const CycleTimeDetailView = ({cycleMetricsTrends, cycleTimeTarget, measurementWindow}) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <div className="tw-grid tw-grid-flow-col tw-grid-cols-3 tw-grid-rows-[auto_1fr_1fr] tw-gap-2 tw-h-full">
      <div className="tw-row-span-3">
        <AvgCycleTime
          displayType="cardAdvanced"
          displayProps={{
            valueClass: "tw-text-2xl",
            trendsView: {
              title: "",
              content: (
                <AvgCycleTime
                  title={<span>Cycle Time</span>}
                  displayType={"trendsCompareCard"}
                  displayProps={{measurementWindow: measurementWindow}}
                  currentMeasurement={current}
                  previousMeasurement={previous}
                />
              ),
              placement: "top",
            },
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className="tw-self-end">
        <span className={"tw-textXs tw-grey tw-italic"}>Value Added</span>
      </div>
      <div className="">
        <AvgDuration
          displayType="cardAdvanced"
          displayProps={{
            valueClass: "tw-text-2xl",
            trendsView: {
              title: "",
              content: (
                <AvgDuration
                  displayType={"trendsCompareCard"}
                  displayProps={{measurementWindow: measurementWindow}}
                  currentMeasurement={current}
                  previousMeasurement={previous}
                />
              ),
              placement: "top",
            },
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className="">
        <AvgEffort
          displayType="cardAdvanced"
          displayProps={{
            valueClass: "tw-text-2xl",
            trendsView: {
              title: "",
              content: (
                <AvgEffort
                  displayType={"trendsCompareCard"}
                  displayProps={{measurementWindow: measurementWindow}}
                  currentMeasurement={current}
                  previousMeasurement={previous}
                />
              ),
              placement: "top",
            },
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className="tw-self-end">
        <span className={"tw-textXs tw-grey tw-italic"}>Non Value-Added</span>
      </div>
      <div className="">
        <AvgLatency
          displayType="cardAdvanced"
          displayProps={{
            valueClass: "tw-text-2xl",
            trendsView: {
              title: "",
              content: (
                <AvgLatency
                  displayType={"trendsCompareCard"}
                  displayProps={{measurementWindow: measurementWindow}}
                  currentMeasurement={current}
                  previousMeasurement={previous}
                />
              ),
              placement: "top",
            },
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
        />
      </div>
      <div className="">
        <PullRequest
          displayType="cardAdvanced"
          displayProps={{}}
          currentMeasurement={current}
          previousMeasurement={previous}
          target={cycleTimeTarget}
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
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === metric,
            onClick: () => setSelectedMetric(metric),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          specsOnly={specsOnly}
        />
      </div>
      <div className={styles.effortOut}>
        <EffortOUT
          displayType="card"
          displayProps={{
            showHighlighted: selectedMetric === "totalEffort",
            onClick: () => setSelectedMetric("totalEffort"),
          }}
          currentMeasurement={current}
          previousMeasurement={previous}
          specsOnly={specsOnly}
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
    contributorCount,
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
              contributorCount={contributorCount}
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