import React from "react";
import {withNavigationContext} from "../../../../../../framework/navigation/components/withNavigationContext";
import {VizItem, VizRow} from "../../../../containers/layout";
import {
  AvgAge,
  AvgDuration,
  AvgLatency,
  CycleTimeCarousel,
  WipCost,
  LatestCommit,
  PercentileAge,
  Wip,
  WipCarousel,
  WipWithLimit,
  AvgCycleTime,
  Throughput,
} from "../../../../components/flowStatistics/flowStatistics";
import {withViewerContext} from "../../../../../../framework/viewer/viewerContext";
import {getItemSuffix, i18nNumber} from "../../../../../../helpers/utility";
import {useIntl} from "react-intl";

import grid from "../../../../../../framework/styles/grids.module.css";
import styles from "./flowMetrics.module.css";
import {getMetricUtils, TrendIndicator, TrendIndicatorDisplayThreshold, TrendIndicatorNew} from "../../../../../../components/misc/statistic/statistic";
import {TrendCard} from "../../../../components/cards/trendCard";
import fontStyles from "../../../../../../framework/styles/fonts.module.css";
import classNames from "classnames";

const FlowBoardSummaryView = ({
  pipelineCycleMetrics,
  specsOnly,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  wipLimit,
  viewerContext,
}) => {
  return (
    <div className={styles.boxWrapper}>
      <div>
        <PercentileAge
          currentMeasurement={pipelineCycleMetrics}
          targetPercentile={cycleTimeTargetPercentile}
          target={cycleTimeTarget}
        />
      </div>
      <div>
        <AvgAge currentMeasurement={pipelineCycleMetrics} target={cycleTimeTarget} />
      </div>
      <div
        style={{
          paddingLeft: "40px",
          borderLeftWidth: "1px",
          borderLeftStyle: "solid",
          borderLeftColor: "rgba(0,0,0,0.1)",
        }}
      >
        <WipWithLimit currentMeasurement={pipelineCycleMetrics} target={wipLimit} specsOnly={specsOnly} />
      </div>
    </div>
  );
};

const CommonWipBoardSummaryView = ({
  pipelineCycleMetrics,
  specsOnly,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  wipLimit,
  latestCommit,
  viewerContext,
}) => {
  return (
    <div className={styles.wipSummary}>
      <div className={grid.firstCol}>
        <Wip currentMeasurement={pipelineCycleMetrics} target={wipLimit} specsOnly={specsOnly} />
      </div>
      <div className={grid.secondCol}>
        <AvgAge currentMeasurement={pipelineCycleMetrics} target={cycleTimeTarget} />
      </div>
      <div className={grid.thirdCol}>
        <WipCost currentMeasurement={pipelineCycleMetrics} specsOnly={specsOnly} />
      </div>
      <div className={grid.fourthCol}>
        <AvgLatency
          title={<span>Commit Latency</span>}
          currentMeasurement={pipelineCycleMetrics}
          targetPercentile={cycleTimeTargetPercentile}
          target={cycleTimeTarget}
        />
      </div>
    </div>
  );
};

const NonFlowBoard20View = ({
  pipelineCycleMetrics,
  specsOnly,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  viewerContext,
}) => {
  return (
    <VizRow h={1}>
      <VizItem w={0.4}>
        <WipCarousel currentMeasurement={pipelineCycleMetrics} specsOnly={specsOnly} />
      </VizItem>
      <VizItem w={0.6}>
        <CycleTimeCarousel
          currentMeasurement={pipelineCycleMetrics}
          targetPercentile={cycleTimeTargetPercentile || targetPercentile}
          target={cycleTimeTarget}
        />
      </VizItem>
    </VizRow>
  );
};

export const ValueBoardSummaryView = ({
  pipelineCycleMetrics,

  latestCommit,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTarget,
  wipLimit,
  specsOnly,
}) => {
  const current = pipelineCycleMetrics;

  return (
    <div>
      <VizRow h={"50"}>
        <VizItem w={1 / 3}>
          <Wip currentMeasurement={current} target={wipLimit} specsOnly={specsOnly} />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgAge currentMeasurement={current} target={cycleTimeTarget} />
        </VizItem>
        <VizItem w={1 / 3}>
          <LatestCommit latestCommit={latestCommit} />
        </VizItem>
      </VizRow>
      <VizRow
        h={"50%"}
        style={{
          paddingTop: "20px",
          borderTop: "1px",
          borderTopStyle: "solid",
          borderTopColor: "rgba(0,0,0,0.1)",
        }}
      >
        <VizItem w={1 / 3}>
          <WipCost currentMeasurement={current} />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgDuration currentMeasurement={current} target={cycleTimeTarget} />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgLatency title={"Idle Time"} currentMeasurement={current} target={cycleTimeTarget} />
        </VizItem>
      </VizRow>
    </div>
  );
};

const PipelineSummaryView = withViewerContext(
  ({
    pipelineCycleMetrics,
    display,
    specsOnly,
    latestCommit,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    wipLimit,
    viewerContext,
  }) => {
    switch (display) {
      case "flowboardSummary":
        return (
          <FlowBoardSummaryView
            {...{
              pipelineCycleMetrics,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext,
            }}
          />
        );
      case "commonWipSummary":
        return (
          <CommonWipBoardSummaryView
            {...{
              pipelineCycleMetrics,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              latestCommit,
              viewerContext,
            }}
          />
        );
      case "valueBoardSummary":
        return (
          <ValueBoardSummaryView
            {...{
              pipelineCycleMetrics,
              latestCommit,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext,
            }}
          />
        );
      default:
        return (
          <NonFlowBoard20View
            {...{
              pipelineCycleMetrics,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext,
            }}
          />
        );
    }
  }
);

function MetricsGroupTitle({children}) {
  return <div className={classNames("tw-col-span-2 tw-font-normal", fontStyles["text-lg"])}>{children}</div>;
}

export function WorkInProgressFlowMetricsView({data, dimension, cycleTimeTarget, specsOnly, days}) {
  const {cycleMetricsTrends} = data[dimension];
  let [currentTrend, previousTrend] = cycleMetricsTrends;

  const specKey = specsOnly ? "workItemsWithCommits" : "workItemsInScope";
  const items = currentTrend[specKey];
  const itemsLabel = getItemSuffix({specsOnly, itemsCount: items});

  // since we don't want to show compared to text in the card
  currentTrend = {...currentTrend, samplingFrequency: undefined, measurementWindow: undefined};
  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-gap-1">
      <MetricsGroupTitle>
        Flow{" "}
        <span className={classNames(fontStyles["text-xs"], "tw-ml-2")}>
          {itemsLabel}, Last {days} Days
        </span>
      </MetricsGroupTitle>
      <Throughput
        title={
          <span>
            Throughput <sup>Avg</sup>
          </span>
        }
        displayType={"card"}
        displayProps={{className: "tw-p-2"}}
        specsOnly={specsOnly}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        measurementWindow={days}
      />
      <AvgCycleTime
        displayType={"card"}
        displayProps={{className: "tw-p-2", targetText: <span>Target {cycleTimeTarget} Days</span>}}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        target={cycleTimeTarget}
      />
    </div>
  );
}

export function WorkInProgressBaseView({data, dimension}) {
  const {pipelineCycleMetrics} = data[dimension];

  const totalEffort = getMetricUtils({
    value: pipelineCycleMetrics["totalEffort"],
    uom: "FTE Days",
    good: TrendIndicator.isNegative,
    precision: pipelineCycleMetrics["totalEffort"] > 10 ? 1 : 2,
    valueRender: (text) => text,
  });

  const commitLatency = getMetricUtils({
    value: pipelineCycleMetrics["avgLatency"],
    uom: "Days",
    good: TrendIndicator.isNegative,
    precision: pipelineCycleMetrics["avgLatency"] > 10 ? 1 : 2,
    valueRender: (text) => text,
  });

  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-gap-1">
      <MetricsGroupTitle>Cost of Unshipped Code</MetricsGroupTitle>
      <TrendCard
        metricTitle={<span>Total Effort</span>}
        metricValue={totalEffort.metricValue}
        suffix={totalEffort.suffix}
        target={<span className="tw-invisible">random text</span>}
        className="tw-p-2"
      />
      <TrendCard
        metricTitle={
          <span>
            Commit Latency <sup>Avg</sup>{" "}
          </span>
        }
        metricValue={commitLatency.metricValue}
        suffix={commitLatency.suffix}
        target={<span className="tw-invisible">random text</span>}
        className="tw-p-2"
      />
    </div>
  );
}

export function WorkInProgressSummaryView({data, dimension, cycleTimeTarget, specsOnly, days, flowMetricsData}) {
  const intl = useIntl();
  const {pipelineCycleMetrics} = data[dimension];

  const cycleMetricsTrend = flowMetricsData[dimension]["cycleMetricsTrends"][0]
  const flowItems = cycleMetricsTrend[specsOnly ? "workItemsWithCommits" : "workItemsInScope"];
  const throughputRate = flowItems / days;
  const wipLimit = i18nNumber(intl, throughputRate * cycleTimeTarget, 0);

  const items = pipelineCycleMetrics[specsOnly ? "workItemsWithCommits" : "workItemsInScope"];
  const wip = getMetricUtils({
    target: wipLimit,
    value: items,
    uom: getItemSuffix({specsOnly, itemsCount: items}),
    good: TrendIndicator.isNegative,
    valueRender: (text) => text,
  });
  const avgAge = getMetricUtils({
    target: cycleTimeTarget,
    value: pipelineCycleMetrics["avgCycleTime"],
    uom: "Days",
    good: TrendIndicator.isNegative,
    precision: pipelineCycleMetrics["avgCycleTime"] > 10 ? 1 : 2,
    valueRender: (text) => text,
  });

  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-gap-1">
      <MetricsGroupTitle>Work in Progress</MetricsGroupTitle>
      <TrendCard
        metricTitle={<span>Total</span>}
        metricValue={wip.metricValue}
        suffix={wip.suffix}
        target={<span>Limit {wipLimit}</span>}
        className="tw-p-2"
      />
      <TrendCard
        metricTitle={
          <span>
            Age <sup>Avg</sup>
          </span>
        }
        metricValue={avgAge.metricValue}
        suffix={avgAge.suffix}
        target={<span>Target {cycleTimeTarget} Days</span>}
        className="tw-p-2"
      />
    </div>
  );
}
export const WipFlowMetricsSummaryView = withNavigationContext(PipelineSummaryView);
