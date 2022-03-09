import React from "react";
import {
  CustomStatistic,
  getMetricUtils,
  Statistic,
  TrendIndicator,
  TrendIndicatorDisplayThreshold,
  TrendIndicatorNew,
  TrendMetric,
  TrendWithTooltip,
} from "../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";
import {ComponentCarousel} from "../componentCarousel/componentCarousel";
import {HumanizedDateView} from "../humanizedDateView/humanizedDateView";
import {TrendCard} from "../cards/trendCard";
import {fromNow} from "../../../../helpers/utility";
import {TrendColors} from "../../config"

export const FlowStatistic = ({
  title,
  displayType="statistic",
  displayProps={},
  currentMeasurement,
  previousMeasurement,
  metric,
  currentValue,
  previousValue,
  uom,
  good,
  target,
  precision,
  deltaThreshold,
  valueRender = (value) => value,
}) => {
  const value = currentValue != null ? currentValue : currentMeasurement && currentMeasurement[metric];
  const comp = previousValue != null ? previousValue : previousMeasurement && previousMeasurement[metric];

  const {metricValue, suffix} = getMetricUtils({target, value, uom, good, valueRender, precision});

  switch (displayType) {
    case "card": {
      const {onClick, showHighlighted, info, size} = displayProps;
      return (
        <TrendCard
          metricTitle={title}
          metricValue={metricValue}
          suffix={suffix}
          showHighlighted={showHighlighted}
          onClick={onClick}
          trendIndicator={
            <TrendIndicatorNew
              firstValue={value}
              secondValue={comp}
              good={good}
              deltaThreshold={deltaThreshold || TrendIndicatorDisplayThreshold}
              samplingFrequency={currentMeasurement?.samplingFrequency || currentMeasurement?.measurementWindow}
            />
          }
          size={size}
          info={info}
        />
      );
    }
    case "statistic": {
      return (
        <CustomStatistic
          title={title}
          trendIndicator={
            <TrendIndicator
              firstValue={value}
              secondValue={comp}
              good={good}
              deltaThreshold={deltaThreshold || TrendIndicatorDisplayThreshold}
            />
          }
          value={metricValue}
          suffix={suffix}
        />
      );
    }
    case "cellrender": {
      return (
        <TrendMetric
          metricValue={metricValue}
          uom={suffix}
          trendIndicator={
            <TrendWithTooltip
              firstValue={value}
              secondValue={comp}
              good={good}
              samplingFrequency={currentMeasurement?.samplingFrequency || currentMeasurement?.measurementWindow}
            />
          }
        />
      );
    }
    default: {
      return null;
    }
  }
};


export const ResponseTime = ({title, displayType, displayProps, currentMeasurement, previousMeasurement, metric, uom, displayName, target, superScript, deltaThreshold}) => (
  <FlowStatistic
    title={title || <span>{displayName}<sup> {superScript} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={metric}
    uom={uom || 'days'}
    precision={2}
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
    displayType={displayType}
    displayProps={displayProps}
  />
);


export const Volume = ({title, displayType, displayProps, normalized, contributorCount, currentMeasurement, previousMeasurement, target, deltaThreshold, specsOnly, measurementWindow}) => {
  const metric = specsOnly ? 'workItemsWithCommits' : 'workItemsInScope';

  return <FlowStatistic
    title={title || <span>Volume {normalized ? <sup><em>pc</em></sup> : ''}</span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={metric}
    valueRender={value => normalized && contributorCount > 0 ? currentMeasurement[metric]/contributorCount : value}
    uom={specsOnly ? 'specs' : 'cards'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    displayType={displayType}
    displayProps={displayProps}
    target={target}
    measurementWindow={measurementWindow}
  />
}

export const Wip = ({title, currentMeasurement, previousMeasurement, target, deltaThreshold, specsOnly}) => {
  const value = currentMeasurement[specsOnly ? 'workItemsWithCommits' : 'workItemsInScope'];
  return (
      <FlowStatistic
        title={title || "Wip"}
        currentValue={value}
        uom={specsOnly ? 'specs' : 'cards'}
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

export const LatestClosed = ({displayType, currentMeasurement}) => (
  displayType==="card" ?
  <FlowStatistic
    title={"Latest Closed"}
    currentMeasurement={currentMeasurement}
    valueRender={value => fromNow(currentMeasurement['latestClosedDate'])}
    displayType="card"
  />
    :
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

export const Cadence = ({title, displayType, currentMeasurement, previousMeasurement, deltaThreshold}) => (
  <FlowStatistic
    title={title || "Cadence"}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'cadence'}
    valueRender={value => `${value}/${currentMeasurement['measurementWindow']}`}
    uom={'days'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    displayType={displayType}
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

export const AvgEffort = ({displayType, displayProps, currentMeasurement, previousMeasurement, good, target, deltaThreshold}) => {

  return <FlowStatistic
    title={<span>{'Effort'}<sup> {'Avg'} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgEffort'}
    precision={2}
    uom={'dev-days'}
    // we want low avg effort. high total with low average means more throughput.
    good={TrendIndicator.isNegative}
    deltaThreshold={deltaThreshold}
    target={target}
    displayType={displayType}
    displayProps={displayProps}
  />
}

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

export const AvgDuration = ({displayType, displayProps, currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgDuration'}
    displayName={'Coding'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    displayType={displayType}
    displayProps={displayProps}
  />
}


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

export const AvgLatency = ({title, displayType, displayProps, currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgLatency'}
    displayName={title || 'Delivery'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    displayType={displayType}
    displayProps={displayProps}
  />
}


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


export const AvgCycleTime = ({displayType, displayProps, currentMeasurement, previousMeasurement, target, deltaThreshold}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    displayType={displayType}
    displayProps={displayProps}
  />
}

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

export const AvgLeadTime = ({displayType, displayProps, currentMeasurement, previousMeasurement, target, deltaThreshold}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgLeadTime'}
    displayName={'Lead Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    displayType={displayType}
    displayProps={displayProps}
  />
}

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


export const ContributorCount = ({title, contributorCount}) => (
  <Statistic
    title={title || 'Contributors'}
    formatter={value => <span className="textXl">{value}</span>}
    value={contributorCount}
    precision={0}
    valueStyle={{color: TrendColors.good}}
  />
);

// ---
//  Commit Days
// ----

export const ActiveDays = ({displayType, displayProps, title, normalized, contributorCount, currentMeasurement, previousMeasurement, metric, uom, precision, displayName, target, superScript, deltaThreshold}) => {

  return <FlowStatistic
    title={title}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={metric}
    valueRender={(value) => normalized && contributorCount > 0 ? currentMeasurement[metric]/contributorCount : value}
    uom={uom}
    precision={precision || 2}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    displayType={displayType}
    displayProps={displayProps}
    target={target}
  />
}

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






export const EffortOUT = ({displayType, displayProps, normalized, contributorCount, currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalEffort'}
    title={<span>{'Effort'}<sub>{'OUT'}</sub> {normalized ? <sup><em>pc</em></sup> : ''}</span>}
    normalized={normalized}
    contributorCount={contributorCount}
    uom={'dev-days'}
    displayType={displayType}
    displayProps={displayProps}
    target={target}
    deltaThreshold={deltaThreshold}
  />
);

export const WipCost = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalEffort'}
    title={<span>Wip Cost</span>}
    target={target}
    uom={'dev-days'}
    precision={1}
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
    formatter={value => <span className="textSm">{value}</span>}
    precision={0}
    valueStyle={{color: TrendColors.good}}
    suffix={'%'}
  />
);

export const Traceability = ({title, displayType, current, previous, target=0.9, deltaThreshold}) => (
  <FlowStatistic
    title={title || "Traceability"}
    currentMeasurement={current}
    previousMeasurement={previous}
    metric={'traceability'}
    displayType={displayType}
    currentValue={current['traceability'] * 100}
    previousValue={previous['traceability'] * 100}
    valueRender={value => current['totalCommits'] > 0 ? `${value?.toFixed?.(2)} %` : 'N/A'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    target={target * 100}
  />
);

export const TotalCommits = ({title, displayType, current, previous, deltaThreshold}) => (
  <FlowStatistic
    title={title || "Total Commits"}
    currentMeasurement={current}
    previousMeasurement={previous}
    metric={'totalCommits'}
    displayType={displayType}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
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