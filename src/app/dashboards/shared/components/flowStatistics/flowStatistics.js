import React from 'react';
import {
  Statistic,
  TrendIndicator,
  TrendIndicatorDisplayThreshold
} from "../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";
import {ComponentCarousel} from "../componentCarousel/componentCarousel";
import {HumanizedDateView} from "../humanizedDateView/humanizedDateView";

const colors = {
  good: '#338807',
  bad: '#9a3727'
}

export const FlowStatistic = ({title, currentMeasurement, previousMeasurement, metric, currentValue, previousValue, uom, good, target, precision, deltaThreshold, valueRender = value => value}) => {

  const value = currentValue != null ?  currentValue :  (currentMeasurement && currentMeasurement[metric]);
  const comp = previousValue != null ? previousValue :  (previousMeasurement && previousMeasurement[metric]);

  const color = target && (value != null) && good && !good(value - target) ? colors.bad : colors.good

  const renderedValue = valueRender(value);
  return (
    <Statistic
      title={title}
      value={ renderedValue != null ? renderedValue : 'N/A'}
      precision={precision || 0}
      valueStyle={{color: color}}
      prefix={
        <TrendIndicator
          firstValue={value}
          secondValue={comp}
          good={good}
          deltaThreshold={deltaThreshold || TrendIndicatorDisplayThreshold}
        />
      }
      suffix={value ? uom : ''}
    />
  )
};


export const ResponseTime = ({title, currentMeasurement, previousMeasurement, metric, uom, displayName, target, superScript, deltaThreshold}) => (
  <FlowStatistic
    title={title || <span>{displayName}<sup> {superScript} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={metric}
    uom={uom || 'Days'}
    precision={1}
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);


export const Volume = ({title, currentMeasurement, previousMeasurement, target, deltaThreshold, specsOnly}) => (
  <FlowStatistic
    title={title || "Volume"}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={specsOnly ? 'workItemsWithCommits' : 'workItemsInScope'}
    uom={specsOnly ? 'Specs' : 'Cards'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const Wip = ({title, currentMeasurement, previousMeasurement, target, deltaThreshold, specsOnly}) => {
  const value = currentMeasurement[specsOnly ? 'workItemsWithCommits' : 'workItemsInScope'];
  return (
      <FlowStatistic
        title={title || "Wip"}
        currentValue={value}
        uom={specsOnly ? 'Specs' : 'Cards'}
        good={TrendIndicator.isNegative}
        deltaThreshold={deltaThreshold}
        target={target}
      />
  )
}

export const WipWithLimit = ({title, currentMeasurement, previousMeasurement, target, deltaThreshold, specsOnly}) => {
  const value = currentMeasurement[specsOnly ? 'workItemsWithCommits' : 'workItemsInScope'];
  return (
    <ComponentCarousel tickInterval={2000} disabled={value < target}>
      <Wip
        title={title}
        currentMeasurement={currentMeasurement}
        previousMeasurement={previousMeasurement}
        target={target}
        deltaThreshold={deltaThreshold}
        specsOnly={specsOnly}
      />
      <FlowStatistic
        title={"Limit"}
        currentValue={target}
        uom={'Cards'}
      />
    </ComponentCarousel>
  )

};

export const LatestClosed = ({currentMeasurement}) => (
  <HumanizedDateView
    asStatistic={true}
    title={'Latest Closed'}
    dateValue={currentMeasurement['latestClosedDate']}
  />
);

export const LatestCommit = ({latestCommit}) => (
  <HumanizedDateView
    asStatistic={true}
    title={'Latest Commit'}
    dateValue={latestCommit}
  />
);

export const Cadence = ({title, currentMeasurement, previousMeasurement, deltaThreshold}) => (
  <FlowStatistic
    title={title || "Cadence"}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'cadence'}
    valueRender={value => `${value}/${currentMeasurement['measurementWindow']}`}
    uom={'Days'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
  />
);

export const TotalEffort = ({title, currentMeasurement, previousMeasurement, good, target, deltaThreshold}) => (
  <FlowStatistic
    title={title ||  <span>{'Effort'}<sup> {'Total'} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalEffort'}
    precision={1}
    uom={'Dev-Days'}
    // we want high total effort
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const AvgEffort = ({currentMeasurement, previousMeasurement, good, target, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{'Effort'}<sup> {'Avg'} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgEffort'}
    precision={1}
    uom={'Dev-Days'}
    // we want low avg effort. high total with low average means more throughput.
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const PercentileEffort = ({currentMeasurement, previousMeasurement, good, target, targetPercentile, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{'Effort'}<sup> {percentileToText(targetPercentile)} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'percentileEffort'}
    precision={1}
    uom={'Dev-Days'}
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const MaxEffort = ({currentMeasurement, previousMeasurement, good, target, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{'Effort'}<sup> {'Max'} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'maxEffort'}
    precision={1}
    uom={'Dev-Days'}
    // we want low avg effort. high total with low average means more throughput.
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const AvgDuration = ({currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgDuration'}
    displayName={'Duration'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);


export const PercentileDuration = ({currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'percentileDuration'}
    displayName={'Duration'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxDuration = ({currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'maxDuration'}
    displayName={'Duration'}
    superScript={'Max'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const AvgLatency = ({title, currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgLatency'}
    displayName={title || 'Latency'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);


export const PercentileLatency = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'percentileLatency'}
    displayName={title || 'Latency'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxLatency = ({title, currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'maxLatency'}
    displayName={title || 'Latency'}
    superScript={'Max'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MinCycleTime = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'minCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Min'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);


export const AvgCycleTime = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const AvgAge = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgCycleTime'}
    displayName={'Age'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxCycleTime = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'maxCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Max'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const PercentileCycleTime = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    title={title}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'percentileCycleTime'}
    displayName={'Cycle Time'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const PercentileAge = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    title={title}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'percentileCycleTime'}
    displayName={'Age'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const AvgLeadTime = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgLeadTime'}
    displayName={'Lead Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxLeadTime = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'maxLeadTime'}
    displayName={'Lead Time'}
    superScript={'Max'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const PercentileLeadTime = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    title={title}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'percentileLeadTime'}
    displayName={'Lead Time'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

// ---
//  Commit Days
// ----

export const ActiveDays = ({title, currentMeasurement, previousMeasurement, metric, uom, displayName, target, superScript, deltaThreshold}) => (
  <FlowStatistic
    title={title || <span>{displayName}<sup> {superScript} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={metric}


    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const AvgActiveDays = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgCommitDays'}
    displayName={'Capacity'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MinActiveDays = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'minCommitDays'}
    displayName={'Capacity'}
    superScript={'Min'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxActiveDays = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'maxCommitDays'}
    displayName={'Capacity'}
    superScript={'Max'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const TotalActiveDays = ({title, currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalCommitDays'}
    title={title || 'Active Days'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);



export const EffortOUT = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalEffort'}
    title={<span>{'Effort'}<sub>{'OUT'}</sub></span>}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const EffortWIP = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalEffort'}
    title={<span>{'Effort'}<sub>{'WIP'}</sub></span>}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);



// ----------------
// Metrics Carousels
// ----------------

export const CycleTimeSLACarousel = ({title, currentMeasurement, previousMeasurement, currentConfidence, previousConfidence, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <FlowStatistic
      title={<span>{'CycleTime'}<sup>{percentileToText(targetPercentile)} Target</sup></span>}
      currentMeasurement={currentConfidence}
      previousMeasurement={previousConfidence}
      metric={'cycleTimeTarget'}
      uom={'Days'}
    />
    <PercentileCycleTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgCycleTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxCycleTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <FlowStatistic
      title={<span>{'% at Target'}</span>}
      currentValue={currentConfidence && (currentConfidence['cycleTimeConfidence'] * 100)}
      previousValue={previousConfidence && (previousConfidence['cycleTimeConfidence'] * 100)}
      uom={'%'}
      precision={2}
      target={target}
      good={TrendIndicator.isPositive}

    />

  </ComponentCarousel>
)

export const CycleTimeCarousel = ({title, currentMeasurement, previousMeasurement, currentConfidence, previousConfidence, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <PercentileCycleTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgCycleTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxCycleTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)

export const LeadTimeCarousel = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <PercentileLeadTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgLeadTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxLeadTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)

export const LeadTimeSLACarousel = ({title, currentMeasurement, previousMeasurement, currentConfidence, previousConfidence, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <FlowStatistic
      title={<span>{'LeadTime'}<sup>{percentileToText(targetPercentile)} Target</sup></span>}
      currentMeasurement={currentConfidence}
      previousMeasurement={previousConfidence}
      metric={'leadTimeTarget'}
      uom={'Days'}
    />
    <PercentileLeadTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgLeadTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxLeadTime
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <FlowStatistic
      title={<span>{'% at Target'}</span>}
      currentValue={currentConfidence && (currentConfidence['leadTimeConfidence'] * 100)}
      previousValue={previousConfidence && (previousConfidence['leadTimeConfidence'] * 100)}
      uom={'%'}
      precision={2}
      target={target}
      good={TrendIndicator.isPositive}

    />
  </ComponentCarousel>
)

export const EffortCarousel = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <PercentileEffort
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgEffort
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxEffort
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)


export const DurationCarousel = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <PercentileDuration
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgDuration
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxDuration
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)

export const LatencyCarousel = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <PercentileLatency
      title={title}
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgLatency
      title={title}
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxLatency
      title={title}
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)

export const VolumeCarousel = ({title, currentMeasurement, previousMeasurement, specsOnly, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <Volume
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
      specsOnly={specsOnly}
    />
    <LatestClosed
      currentMeasurement={currentMeasurement}
    />
    <EffortOUT
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)

export const WipCarousel = ({title, currentMeasurement, specsOnly, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel specsOnly={specsOnly} tickInterval={tickInterval}>
    <Volume
      title={'Wip'}
      currentMeasurement={currentMeasurement}
      specsOnly={specsOnly}
    />
    <AvgDuration
      currentMeasurement={currentMeasurement}
    />
    <TotalEffort
      currentMeasurement={currentMeasurement}
    />
  </ComponentCarousel>
)

export const TraceabilityTarget = ({title, target}) => (
  <Statistic
    title={'Target'}
    value={target * 100}
    precision={0}
    valueStyle={{color: colors.good}}
    suffix={'%'}
  />
);

export const Traceability = ({title, current, previous, target, deltaThreshold}) => (
  <FlowStatistic
    title={title || "Traceability"}
    currentValue={current['traceability'] * 100}
    previousValue={previous['traceability'] * 100}
    uom={'%'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target * 100}
  />
);


export const TraceabilityCarousel = ({title, current, previous, target, deltaThreshold, disabled = false, tickInterval = 3000}) => (
  <ComponentCarousel disabled={disabled} tickInterval={tickInterval}>
    <Traceability
      title={title}
      current={current}
      previous={previous}
      target={target}
      deltaThreshold={deltaThreshold}
    />
    <TraceabilityTarget
      current={current}
      previous={previous}
      target={target}
      deltaThreshold={deltaThreshold}
    />

  </ComponentCarousel>
)

export const CommitDaysCarousel = ({current, previous, target, deltaThreshold, disabled = false, tickInterval = 3000}) => (
  <ComponentCarousel disabled={disabled} tickInterval={tickInterval}>
    <TotalActiveDays
      currentMeasurement={current}
      previousMeasurement={previous}
      target={target}
      deltaThreshold={deltaThreshold}
    />
    <avgActiveDays
      currentMeasurement={current}
      previousMeasurement={previous}
      target={target}
      deltaThreshold={deltaThreshold}
    />
    <MaxActiveDays
      currentMeasurement={current}
      previousMeasurement={previous}
      target={target}
      deltaThreshold={deltaThreshold}
    />
    <MinActiveDays
      currentMeasurement={current}
      previousMeasurement={previous}
      target={target}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)