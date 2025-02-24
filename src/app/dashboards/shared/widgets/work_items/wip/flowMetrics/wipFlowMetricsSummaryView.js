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
  TotalEffort,
} from "../../../../components/flowStatistics/flowStatistics";
import {withViewerContext} from "../../../../../../framework/viewer/viewerContext";
import {average, getItemSuffix, i18nNumber} from "../../../../../../helpers/utility";
import {useIntl} from "react-intl";

import grid from "../../../../../../framework/styles/grids.module.css";
import styles from "./flowMetrics.module.css";
import fontStyles from "../../../../../../framework/styles/fonts.module.css";
import classNames from "classnames";
import { DevItemRatio, getWipLimit, getWorkItemDurations, useWipMetricsCommon } from "../../clientSideFlowMetrics";
import { Quadrants, getQuadrant } from "../cycleTimeLatency/cycleTimeLatencyUtils";
import { getPercentage } from "../../../../../projects/shared/helper/utils";

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
          <AvgLatency title={"Latency"} currentMeasurement={current} target={cycleTimeTarget} />
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
  const items = currentTrend?.[specKey];
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
        displayProps={{className: "tw-p-2", testId: "throughput"}}
        specsOnly={specsOnly}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        measurementWindow={days}
      />
      <AvgCycleTime
        displayType={"card"}
        displayProps={{className: "tw-p-2", supportingMetric: <span>Target {cycleTimeTarget} Days</span>, testId: "cycletime"}}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        target={cycleTimeTarget}
      />
    </div>
  );
}

export function WorkInProgressBaseView({data, dimension}) {
  const {pipelineCycleMetrics} = data[dimension];


  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-gap-1">
      <MetricsGroupTitle>Cost of Unshipped Code</MetricsGroupTitle>
      <TotalEffort 
        displayType="card"
        currentMeasurement={pipelineCycleMetrics}
        displayProps={{className: "tw-p-2", supportingMetric: <span className="tw-invisible">random text</span>, testId: "total-effort"}}
      />
      <AvgLatency
        title={
          <span>
            Commit Latency
          </span>
        }
        displayType="card"
        currentMeasurement={pipelineCycleMetrics}
        displayProps={{className: "tw-p-2", supportingMetric: <span className="tw-invisible">random text</span>, testId: "commit-latency"}}
       />
    </div>
  );
}

export function WorkInProgressSummaryView({wipDataAll, dimension, cycleTimeTarget, latencyTarget, specsOnly, days, flowMetricsData, displayBag={}}) {
  const {excludeMotionless} = displayBag;
  const intl = useIntl();
  
  const {wipLimit, motionLimit, pipelineCycleMetrics, workItemAggregateDurationsForSpecs, workItemAggregateDurations, specEpicsCount, epicsCount} =
    useWipMetricsCommon({
      wipDataAll,
      flowMetricsData,
      dimension,
      specsOnly,
      days,
      excludeMotionless,
      cycleTimeTarget,
      latencyTarget,
    });

    const bottomRightElement = specsOnly
      ? {
        bottomRightView: {
          bottomRightElement: displayBag?.traceabilityStat,
          title: null,
          content: displayBag?.traceability,
          placement: "top",
        },
      }
      : {
        bottomRightView: {
          bottomRightElement: (
            <DevItemRatio
              devItemsCount={workItemAggregateDurationsForSpecs.length}
              devItemsPercentage={getPercentage(
                workItemAggregateDurations.length > 0
                  ? workItemAggregateDurationsForSpecs.length / workItemAggregateDurations.length
                  : 0,
                intl
              )}
            />
          ),
          title: null,
          content: displayBag?.traceability,
          placement: "top",
        },
      };
    
  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-grid-rows-[auto_1fr] tw-gap-1">
      <MetricsGroupTitle>Flow Metrics, Work In Process</MetricsGroupTitle>
      <Wip
        title={
          <div className="tw-flex tw-flex-col">
            <div>WIP</div>
            <div className="tw-text-base">{specsOnly ? specEpicsCount : epicsCount} Epics</div>
          </div>
        }
        currentMeasurement={pipelineCycleMetrics}
        specsOnly={specsOnly}
        target={wipLimit}
        displayType="cardAdvanced"
        displayProps={{
          className: "tw-p-2",
          supportingMetric: <span>Limit {wipLimit}</span>,
          ...bottomRightElement,
          testId: "wip-total",
          midTarget: motionLimit,
        }}
      />
      <AvgAge
        currentMeasurement={pipelineCycleMetrics}
        target={cycleTimeTarget}
        displayType="cardAdvanced"
        displayProps={{
          className: "tw-p-2",
          supportingMetric: <span>Target {cycleTimeTarget} Days</span>,
          testId: "wip-age",
        }}
      />
    </div>
  );
}
export const WipFlowMetricsSummaryView = withNavigationContext(PipelineSummaryView);
