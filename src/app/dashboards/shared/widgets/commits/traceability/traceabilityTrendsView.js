import React from 'react';
import {TraceabilityTrendsChart} from "./traceabilityTrendsChart";
import {VizItem, VizRow} from "../../../containers/layout";

import {Traceability, TraceabilityTarget} from "../../../components/flowStatistics/flowStatistics";
import { TrendIndicator, TrendIndicatorDisplayThreshold, TrendIndicatorNew, getMetricUtils, getTrendIndicatorUtils } from '../../../../../components/misc/statistic/statistic';
import { useIntl } from 'react-intl';


const TraceabilityStatisticView = (
  {
    title,
    current,
    previous,
    target,
    primaryStatOnly
  }
) => (
  primaryStatOnly ?
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <Traceability
          title={title}
          current={current}
          previous={previous}
          target={target}
        />
      </VizItem>
    </VizRow>
    :
    <VizRow h={"100%"}>
      <VizItem w={0.5}>
        <TraceabilityTarget
          target={target}
        />
      </VizItem>
      <VizItem w={0.5}>
        <Traceability
          title={'Actual'}
          current={current}
          previous={previous}
          target={target}
        />
      </VizItem>
    </VizRow>
);

const TraceabilityChartView = (
  {
    traceabilityTrends,
    measurementPeriod,
    measurementWindow,
    excludeMerges,
    target
  }
) => (
  <VizRow h={"100%"}>
    <VizItem w={1}>
      <TraceabilityTrendsChart
        traceabilityTrends={traceabilityTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        excludeMerges={excludeMerges}
        target={target}
      />
    </VizItem>
  </VizRow>
);


export const ProjectTraceabilityTrendsView = (
  {
    traceabilityTrends,
    measurementPeriod,
    measurementWindow,
    excludeMerges,
    asStatistic,
    primaryStatOnly,
    title,
    target,
    displayBag={}
  }) => {
    const intl = useIntl();
  // trends come back in descending order so this is canonical pattern to
  // extract the current and previous value.
  const [current, previous] = traceabilityTrends;

  if (displayBag.displayType === "trendsCompareCard") {
    return (
      <Traceability
        title={title}
        current={current}
        previous={previous}
        target={target}
        displayType={displayBag.displayType}
        displayProps={{measurementWindow: measurementWindow}}
      />
    );
  }

  if (displayBag.displayType === "normStat") {
    const currentValue = (current?.["traceability"]??0) * 100;
    const previousValue = (previous?.["traceability"]??0) * 100;

    const {metricValue} = getMetricUtils({
      target: target * 100,
      value: currentValue,
      good: TrendIndicator.isPositive,
      valueRender: (value) => (current["totalCommits"] > 0 ? `${value?.toFixed?.(2)} %` : "N/A"),
    });
    const {trendIndicatorIcon} = getTrendIndicatorUtils({
      currentValue: currentValue,
      previousValue: previousValue,
      good: TrendIndicator.isPositive,
      intl,
    });
    return (
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-flex tw-flex-col tw-items-center">
          <div className="tw-textXl">Traceability</div>
          <div className="!tw-text-lg !tw-font-semibold">{metricValue} </div>
        </div>

        <div className="tw-text-xl">{trendIndicatorIcon}</div>
      </div>
    );
  }

  return (
    asStatistic ?
      <TraceabilityStatisticView
        title={asStatistic.title}
        current={current}
        previous={previous}
        target={target}
        primaryStatOnly={primaryStatOnly}
      />
      :
      <TraceabilityChartView
        traceabilityTrends={traceabilityTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        excludeMerges={excludeMerges}
        target={target}
        />
  )
}

