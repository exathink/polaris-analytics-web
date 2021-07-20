import React from "react";
import {
  Statistic,
  TrendIndicator,
  TrendIndicatorDisplayThreshold,
  TrendIndicatorNew,
} from "../../../../components/misc/statistic/statistic";
import {percentileToText} from "../../../../helpers/utility";
import {ComponentCarousel} from "../componentCarousel/componentCarousel";
import {HumanizedDateView} from "../humanizedDateView/humanizedDateView";
import {TrendCard} from "../cards/trendCard";
import {fromNow} from "../../../../helpers/utility";

const colors = {
  good: "#338807",
  bad: "#9a3727",
};

export const FlowStatistic = ({
  title,
  asCard = false,
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
  info,
  showHighlighted,
  onClick,
  size
}) => {
  const value = currentValue != null ? currentValue : currentMeasurement && currentMeasurement[metric];
  const comp = previousValue != null ? previousValue : previousMeasurement && previousMeasurement[metric];

  const color = target && value != null && good && !good(value - target) ? colors.bad : colors.good;

  const renderedValue = valueRender(value);
  return asCard ? (
    // <Card
    //   title={title}
    //   size={"small"}
    //   hoverable
    //   bordered
    //   extra={<InfoCard title={title} content={info.headline} drawerContent={info.drawerContent} />}
    // >
    //   <Statistic
    //     value={renderedValue != null ? renderedValue : "N/A"}
    //     precision={precision || 0}
    //     valueStyle={{color: color}}
    //     prefix={
    //       <TrendIndicator
    //         firstValue={value}
    //         secondValue={comp}
    //         good={good}
    //         deltaThreshold={deltaThreshold || TrendIndicatorDisplayThreshold}
    //       />
    //     }
    //     suffix={value ? uom : ""}
    //   />
    // </Card>
    <TrendCard
      metricTitle={title}
      metricValue={renderedValue ? renderedValue.toFixed ? renderedValue.toFixed(precision || 0) : renderedValue :   "N/A"}
      suffix={value ? uom : ""}
      showHighlighted={showHighlighted}
      onClick={onClick}
      trendIndicator={
        <TrendIndicatorNew
          firstValue={value}
          secondValue={comp}
          good={good}
          deltaThreshold={deltaThreshold || TrendIndicatorDisplayThreshold}
          measurementWindow={currentMeasurement.measurementWindow}
        />
      }
      size={size}
      info={info}

    />
  ) : (
    <Statistic
      title={title}
      value={renderedValue != null ? renderedValue : "N/A"}
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
      suffix={value ? uom : ""}
    />
  );
};


export const ResponseTime = ({title, info, asCard, currentMeasurement, previousMeasurement, metric, uom, displayName, target, superScript, deltaThreshold, onClick, showHighlighted}) => (
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
    asCard={asCard}
    info={info}
    onClick={onClick}
    showHighlighted={showHighlighted}
  />
);


export const Volume = ({title, asCard, currentMeasurement, previousMeasurement, target, deltaThreshold, specsOnly, measurementWindow, onClick, showHighlighted}) => {
  const metric = specsOnly ? 'workItemsWithCommits' : 'workItemsInScope';

  return <FlowStatistic
    title={title || "Volume"}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={metric}
    uom={specsOnly ? 'Specs' : 'Cards'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    asCard={asCard}
    target={target}
    measurementWindow={measurementWindow}
    showHighlighted={showHighlighted}
    onClick={onClick}
    info={{
      headline: "sample headline",
      drawerContent: <div><p>Some content</p></div>
    }}
  />
}

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

export const LatestClosed = ({asCard, currentMeasurement}) => (
  asCard ?
  <FlowStatistic
    title={"Latest Closed"}
    currentMeasurement={currentMeasurement}
    valueRender={value => fromNow(currentMeasurement['latestClosedDate'])}
    asCard={true}
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

export const Cadence = ({title, asCard, currentMeasurement, previousMeasurement, deltaThreshold}) => (
  <FlowStatistic
    title={title || "Cadence"}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'cadence'}
    valueRender={value => `${value}/${currentMeasurement['measurementWindow']}`}
    uom={'Days'}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    asCard={asCard}
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

export const AvgEffort = ({asCard, currentMeasurement, previousMeasurement, good, target, deltaThreshold, onClick, showHighlighted}) => {

  return <FlowStatistic
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
    asCard={asCard}
    onClick={onClick}
    showHighlighted={showHighlighted}
    info={{
      headline: "The average elapsed time a card spent in implementation and delivery.",
      drawerContent: <div><p>Some content</p></div>
    }}
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

export const AvgDuration = ({asCard, currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold, onClick, showHighlighted}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgDuration'}
    displayName={'Implementation'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    asCard={asCard}
    onClick={onClick}
    showHighlighted={showHighlighted}
    info={{
      headline: "The elapsed time from the earliest commit to the latest commit.",
      drawerContent: <div><p>Some content</p></div>
    }}
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

export const AvgLatency = ({title, asCard, currentMeasurement, previousMeasurement, showTrendIndicator, good, target, deltaThreshold, onClick, showHighlighted}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgLatency'}
    displayName={title || 'Delivery'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    asCard={asCard}
    onClick={onClick}
    showHighlighted={showHighlighted}
    info={{
      headline: "The elapsed time from the latest commit till the time the card was closed.",
      drawerContent: <div><p>Some content</p></div>
    }}
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


export const AvgCycleTime = ({asCard, currentMeasurement, previousMeasurement, target, deltaThreshold, onClick, showHighlighted}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgCycleTime'}
    displayName={'Cycle Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    asCard={asCard}
    onClick={onClick}
    showHighlighted={showHighlighted}
    info={{
      headline: "The average elapsed time a card spent in implementation and delivery.",
      drawerContent: <div><p>Some content</p></div>
    }}
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

export const AvgLeadTime = ({asCard, currentMeasurement, previousMeasurement, target, deltaThreshold, onClick, showHighlighted}) => {

  return <ResponseTime
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'avgLeadTime'}
    displayName={'Lead Time'}
    superScript={'Avg'}
    target={target}
    deltaThreshold={deltaThreshold}
    asCard={asCard}
    onClick={onClick}
    showHighlighted={showHighlighted}
    info={{
      headline: "The average elapsed time since a card was created to the time the card was closed.",
      drawerContent: <div><p>Some content</p></div>
    }}
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

// ---
//  Commit Days
// ----

export const ActiveDays = ({asCard, title, currentMeasurement, previousMeasurement, metric, uom, displayName, target, superScript, deltaThreshold, onClick, showHighlighted}) => {

  return <FlowStatistic
    title={title || <span>{displayName}<sup> {superScript} </sup></span>}
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={metric}
    uom={uom}
    good={TrendIndicator.isPositive}
    deltaThreshold={deltaThreshold}
    asCard={asCard}
    target={target}
    onClick={onClick}
    showHighlighted={showHighlighted}
    info={{
      headline: "sample headline",
      drawerContent: <div><p>Some content</p></div>
    }}
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




export const EffortOUT = ({asCard, currentMeasurement, previousMeasurement, target, deltaThreshold, onClick, showHighlighted}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalEffort'}
    title={<span>{'Effort'}<sub>{'OUT'}</sub></span>}
    uom={'Dev-Days'}
    asCard={asCard}
    target={target}
    deltaThreshold={deltaThreshold}
    onClick={onClick}
    showHighlighted={showHighlighted}
  />
);

export const WipCost = ({currentMeasurement, previousMeasurement, target, deltaThreshold}) => (
  <ActiveDays
    currentMeasurement={currentMeasurement}
    previousMeasurement={previousMeasurement}
    metric={'totalEffort'}
    title={<span>Wip Cost</span>}
    target={target}
    uom={'Dev-Days'}
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