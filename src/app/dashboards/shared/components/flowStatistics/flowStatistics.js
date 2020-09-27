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

export const FlowStatistic = ({title, currentMeasurement, previousMeasurement,  metric, currentValue, previousValue, uom, good, target, precision, deltaThreshold}) => {

  const value = currentValue || (currentMeasurement && currentMeasurement[metric]) ;
  const comp = previousValue || (previousMeasurement && previousMeasurement[metric]);

  const color = target && value && good && !good(value - target) ? colors.bad : colors.good
  return (
    <Statistic
      title={title}
      value={value || 'N/A'}
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

export const Traceability = ({title, currentMetric, previousMetric, target, deltaThreshold}) => (
  <FlowStatistic
    title={title || 'Traceability'}
    currentMeasurement={currentMetric}
    previousMeasurement={previousMetric}
    metric={'traceability'}
    display={value => value * 100}
    uom={'%'}
    precision={1}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);


export const Throughput = ({currentMeasurement, previousMeasurement, target, deltaThreshold, specsOnly}) => (
  <FlowStatistic
    title={"Throughput"}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={specsOnly ? 'workItemsWithCommits' : 'workItemsInScope'}
    uom={specsOnly ? 'Specs' : 'Items'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const LatestClosed = ({currentMeasurement}) => (
  <HumanizedDateView
    asStatistic={true}
    title={'Latest Closed'}
    dateValue={currentMeasurement['latestClosedDate']}
  />
);

export const TotalEffort = ({currentMeasurement, previousMeasurement, good, target, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{'Effort'}<sup> {'Total'} </sup></span>}
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

export const AvgLatency = ({currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgLatency'}
    displayName={'Latency'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);


export const PercentileLatency = ({currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'percentileLatency'}
    displayName={'Latency'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxLatency = ({currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => (
  <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'maxLatency'}
    displayName={'Latency'}
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

// ----------------
// Metrics Carousels
// ----------------

export const CycleTimeCarousel = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
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

export const EffortCarousel = ({title, currentMeasurement, previousMeasurement, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <TotalEffort
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
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <AvgLatency
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
    <MaxLatency
      currentMeasurement={currentMeasurement}
      previousMeasurement={previousMeasurement}
      target={target}
      targetPercentile={targetPercentile}
      deltaThreshold={deltaThreshold}
    />
  </ComponentCarousel>
)

export const ThroughputCarousel = ({title, currentMeasurement, previousMeasurement, specsOnly, target, targetPercentile, deltaThreshold, tickInterval = 3000}) => (
  <ComponentCarousel tickInterval={tickInterval}>
    <Throughput
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

  </ComponentCarousel>
)

export const TraceabilityCarousel = ({title, current, previous, target, deltaThreshold, disabled=false, tickInterval = 3000}) => (
    <ComponentCarousel disabled={disabled} tickInterval={tickInterval}>
      <FlowStatistic
        title={title || "Traceability"}
        currentValue={current['traceability']*100}
        previousValue={previous['traceability']*100}
        uom={'%'}
        good={TrendIndicator.isPositive}
        deltaThreshold={deltaThreshold}
        target={target*100}
      />
      <Statistic
        title={'Target'}
        value={target * 100}
        precision={0}
        valueStyle={{color: colors.good}}
        suffix={'%'}
      />
    </ComponentCarousel>
  )