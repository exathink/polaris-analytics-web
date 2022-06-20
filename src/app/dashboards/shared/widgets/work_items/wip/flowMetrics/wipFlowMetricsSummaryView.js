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
} from "../../../../components/flowStatistics/flowStatistics";
import {withViewerContext} from "../../../../../../framework/viewer/viewerContext";
import {i18nNumber} from "../../../../../../helpers/utility";
import {useIntl} from "react-intl";

import grid from "../../../../../../framework/styles/grids.module.css";
import styles from "./flowMetrics.module.css";
import {getMetricUtils, TrendIndicator} from "../../../../../../components/misc/statistic/statistic";
import {TrendCard} from "../../../../components/cards/trendCard";

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

export function WorkInProgressFlowMetricsView({data, dimension, cycleTimeTarget, specsOnly, days}) {
  const intl = useIntl();
  const {cycleMetricsTrends} = data[dimension];
  const [currentTrend] = cycleMetricsTrends;
  const itemsLabel = specsOnly ? "Specs" : "Cards";

  const items = currentTrend[specsOnly ? "workItemsWithCommits" : "workItemsInScope"];
  const throughput = getMetricUtils({
    value: i18nNumber(intl, items / days, 2),
    uom: `${itemsLabel} / Day`,
    good: TrendIndicator.isPositive,
    precision: items > 10 ? 1 : 2,
    valueRender: (text) => text,
  });

  const cycleTime = getMetricUtils({
    target: cycleTimeTarget,
    value: currentTrend["avgCycleTime"],
    uom: "Days",
    good: TrendIndicator.isNegative,
    precision: currentTrend["cycleTime"] > 10 ? 1 : 2,
    valueRender: (text) => text,
  });

  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-gap-1">
      <div className="tw-col-span-2 tw-text-base">
        Closed {itemsLabel}, Last {days} Days
      </div>
      <TrendCard
        metricTitle={<span>Throughput</span>}
        metricValue={throughput.metricValue}
        suffix={throughput.suffix}
      />
      <TrendCard
        metricTitle={
          <span>
            Cycle Time <sup>avg</sup>
          </span>
        }
        metricValue={cycleTime.metricValue}
        suffix={cycleTime.suffix}
        target={<span className="tw-text-[1vh]">Target: {cycleTimeTarget} Days</span>}
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
      <div className="tw-col-span-2 tw-text-base">Wip Cost</div>
      <TrendCard
        metricTitle={<span>Total Effort</span>}
        metricValue={totalEffort.metricValue}
        suffix={totalEffort.suffix}
      />
      <TrendCard
        metricTitle={<span>Commit Latency </span>}
        metricValue={commitLatency.metricValue}
        suffix={commitLatency.suffix}
      />
    </div>
  );
}

export function WorkInProgressSummaryView({data, dimension, cycleTimeTarget, specsOnly}) {
  const {pipelineCycleMetrics} = data[dimension];

  const items = pipelineCycleMetrics[specsOnly ? "workItemsWithCommits" : "workItemsInScope"];
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
      <div className="tw-col-span-2 tw-text-base">Work in Progress</div>
      <TrendCard metricTitle={<span>Total</span>} metricValue={items} suffix={specsOnly ? "Specs" : "Cards"} />
      <TrendCard
        metricTitle={
          <span>
            Age <sup>avg</sup>
          </span>
        }
        metricValue={avgAge.metricValue}
        suffix={avgAge.suffix}
      />
    </div>
  );
}
export const WipFlowMetricsSummaryView = withNavigationContext(PipelineSummaryView);
