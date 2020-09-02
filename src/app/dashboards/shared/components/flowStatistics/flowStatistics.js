import React from 'react';
import {
  Statistic,
  TrendIndicator,
  TrendIndicatorDisplayThreshold
} from "../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";


const FlowStatistic = ({currentCycleMetrics, previousCycleMetrics, title, metric, uom, good, deltaThreshold}) => {
  const value = (currentCycleMetrics && currentCycleMetrics[metric]) || 'N/A';
  return (
    <Statistic
      title={title}
      value={value}
      precision={0}
      valueStyle={{color: '#3f8600'}}
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


export const ResponseTime = ({currentCycleMetrics, previousCycleMetrics, metric, uom, displayName, superScript, deltaThreshold}) => (
  <FlowStatistic
    title={<span>{displayName}<sup> {superScript} </sup></span>}
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={metric}
    uom={uom || 'Days'}
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
  />
);




export const Throughput = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold, specsOnly}) => (
  <FlowStatistic
    title={"Throughput"}
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={specsOnly? 'workItemsWithCommits' : 'workItemsInScope'}
    uom={specsOnly ? 'Specs' : 'Items'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
  />
);

export const TotalEffort = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold}) => (
  <FlowStatistic
    title={"Total Effort"}
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'totalEffort'}
    uom={'Dev-Days'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
  />
);

export const AvgDuration = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'avgDuration'}
    displayName={'Duration'}
    superScript={'Avg'}
  />
);

export const PercentileDuration = ({currentCycleMetrics, previousCycleMetrics, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'percentileDuration'}
    displayName={'Duration'}
    superScript={percentileToText(targetPercentile)}
  />
);

export const MinCycleTime = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'minCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Min'}
  />
);



export const AvgCycleTime = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'avgCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Avg'}
  />
);

export const MaxCycleTime = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'maxCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Max'}
  />
);

export const PercentileCycleTime = ({currentCycleMetrics, previousCycleMetrics, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'percentileCycleTime'}
    displayName={'Cycle Time'}
    superScript={percentileToText(targetPercentile)}
  />
);

export const AvgLeadTime = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'avgLeadTime'}
    displayName={'Lead Time'}
    superScript={'Avg'}
  />
);

export const MaxLeadTime = ({currentCycleMetrics, previousCycleMetrics, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'maxLeadTime'}
    displayName={'Lead Time'}
    superScript={'Max'}
  />
);

export const PercentileLeadTime = ({currentCycleMetrics, previousCycleMetrics, targetPercentile, deltaThreshold}) => (
  <ResponseTime
    currentCycleMetrics={currentCycleMetrics}
    previousCycleMetrics={previousCycleMetrics}
    metric={'percentileLeadTime'}
    displayName={'Lead Time'}
    superScript={percentileToText(targetPercentile)}
  />
);



