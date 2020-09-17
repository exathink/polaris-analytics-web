import React from 'react';
import {
  Statistic,
  TrendIndicator,
  TrendIndicatorDisplayThreshold
} from "../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";


export const FlowStatistic = ({currentCycleMetrics, previousCycleMetrics, title, metric, uom, good, target, display, precision, deltaThreshold}) => {
  const displayValue = display || (value => value)
  const value = (currentCycleMetrics && displayValue(currentCycleMetrics[metric])) || 'N/A';

  const color = target && currentCycleMetrics && good && !good(currentCycleMetrics[metric] - target) ? '#9a3727' : '#338807'
  return (
    <Statistic
      title={title}
      value={value}
      precision={precision || 0}
      valueStyle={{color: color }}
      prefix={
        <TrendIndicator
          firstValue={(currentCycleMetrics && currentCycleMetrics[metric])}
          secondValue={(previousCycleMetrics && previousCycleMetrics[metric])}
          good={good}
          deltaThreshold={deltaThreshold || TrendIndicatorDisplayThreshold}
        />
      }
      suffix={value !== 'N/A' ? uom : ''}
    />
  )
};


export const ResponseTime = ({currentCycleMetrics, previousCycleMetrics, metric, uom, displayName, target,  superScript, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{displayName}<sup> {superScript} </sup></span>}
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={metric}
    uom={uom || 'Days'}
    precision={1}
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const Traceability = ({currentMetric, previousMetric, target,  deltaThreshold}) => (
  <FlowStatistic
    title={'Traceability'}
    currentCycleMetrics={currentMetric}
    previousCycleMetrics={previousMetric}
    metric={'traceability'}
    display={value => value * 100}
    uom={'%'}
    precision={1}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);




export const Throughput = ({currentCycleMetrics, previousCycleMetrics, target, deltaThreshold, specsOnly}) => (
  <FlowStatistic
    title={"Throughput"}
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={specsOnly? 'workItemsWithCommits' : 'workItemsInScope'}
    uom={specsOnly ? 'Specs' : 'Items'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const TotalEffort = ({currentCycleMetrics, previousCycleMetrics, good, target, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{'Effort'}<sup> {'Total'} </sup></span>}
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'totalEffort'}
    precision={1}
    uom={'Dev-Days'}
    // we want high total effort
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const AvgEffort = ({currentCycleMetrics, previousCycleMetrics, good, target, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{'Effort'}<sup> {'Avg'} </sup></span>}
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'avgEffort'}
    precision={1}
    uom={'Dev-Days'}
    // we want low avg effort. high total with low average means more throughput.
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
  />
);

export const AvgDuration = ({currentCycleMetrics, previousCycleMetrics, showTrendIndicator, good, target, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'avgDuration'}
    displayName={'Duration'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const PercentileDuration = ({currentCycleMetrics, previousCycleMetrics, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'percentileDuration'}
    displayName={'Duration'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MinCycleTime = ({currentCycleMetrics, previousCycleMetrics, target,  deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'minCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Min'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);



export const AvgCycleTime = ({currentCycleMetrics, previousCycleMetrics, target, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'avgCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxCycleTime = ({currentCycleMetrics, previousCycleMetrics, target,  deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'maxCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Max'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const PercentileCycleTime = ({currentCycleMetrics, previousCycleMetrics, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'percentileCycleTime'}
    displayName={'Cycle Time'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const AvgLeadTime = ({currentCycleMetrics, previousCycleMetrics, target,  deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'avgLeadTime'}
    displayName={'Lead Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const MaxLeadTime = ({currentCycleMetrics, previousCycleMetrics, target, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'maxLeadTime'}
    displayName={'Lead Time'}
    superScript={'Max'}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const PercentileLeadTime = ({currentCycleMetrics, previousCycleMetrics, target, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'percentileLeadTime'}
    displayName={'Lead Time'}
    superScript={percentileToText(targetPercentile)}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);



