import React from "react";
import { withNavigationContext } from "../../../../../../framework/navigation/components/withNavigationContext";
import { VizItem, VizRow } from "../../../../containers/layout";
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
  WipWithLimit

} from "../../../../components/flowStatistics/flowStatistics";
import { withViewerContext } from "../../../../../../framework/viewer/viewerContext";
import {MetricCard, MultipleMetricsCard} from "../../../../components/cards/metricCard";
import { humanizeDuration, i18nNumber } from "../../../../../../helpers/utility";
import { useIntl } from "react-intl";

import grid from "../../../../../../framework/styles/grids.module.css";
import styles from "./flowMetrics.module.css";
import { getMetricUtils, TrendIndicator } from "../../../../../../components/misc/statistic/statistic";

const FlowBoardSummaryView = ({
                                pipelineCycleMetrics,
                                specsOnly,
                                targetPercentile,
                                leadTimeTargetPercentile,
                                cycleTimeTargetPercentile,
                                leadTimeTarget,
                                cycleTimeTarget,
                                wipLimit,
                                viewerContext
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
          borderLeftColor: "rgba(0,0,0,0.1)"
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
                                     viewerContext
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

const NonFlowBoard20View = (
  {
    pipelineCycleMetrics,
    specsOnly,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    viewerContext
  }
) => {

  return (
    <VizRow h={1}>
      <VizItem w={0.4}>
        <WipCarousel
          currentMeasurement={pipelineCycleMetrics}
          specsOnly={specsOnly}
        />
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

export const ValueBoardSummaryView = (
  {

    pipelineCycleMetrics,

    latestCommit,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    wipLimit,
    specsOnly

  }
) => {
  const current = pipelineCycleMetrics;

  return (
    <div>
      <VizRow h={"50"}>
        <VizItem w={1 / 3}>
          <Wip
            currentMeasurement={current}
            target={wipLimit}
            specsOnly={specsOnly}
          />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgAge
            currentMeasurement={current}

            target={cycleTimeTarget}
          />
        </VizItem>
        <VizItem w={1 / 3}>
          <LatestCommit
            latestCommit={latestCommit}
          />
        </VizItem>
      </VizRow>
      <VizRow h={"50%"}
              style={{
                paddingTop: "20px",
                borderTop: "1px",
                borderTopStyle: "solid",
                borderTopColor: "rgba(0,0,0,0.1)"
              }}>
        <VizItem w={1 / 3}>
          <WipCost
            currentMeasurement={current}
          />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgDuration
            currentMeasurement={current}

            target={cycleTimeTarget}
          />
        </VizItem>
        <VizItem w={1 / 3}>
          <AvgLatency
            title={"Idle Time"}
            currentMeasurement={current}

            target={cycleTimeTarget}
          />
        </VizItem>
      </VizRow>
    </div>
  );
};

const PipelineSummaryView = withViewerContext((
  {
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
    viewerContext
  }
) => {

  switch (display) {
    case "flowboardSummary":
      return (
        <FlowBoardSummaryView
          {
            ...{
              pipelineCycleMetrics,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext
            }
          } />
      );
    case "commonWipSummary":
      return (
        <CommonWipBoardSummaryView
          {
            ...{
              pipelineCycleMetrics,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              latestCommit,
              viewerContext
            }
          } />
      );
    case "wipSummary":
      return (
        <WorkInProgressSummaryView
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
          {
            ...{
              pipelineCycleMetrics,
              latestCommit,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext
            }
          } />
      );
    default:
      return (
        <NonFlowBoard20View
          {
            ...{
              pipelineCycleMetrics,
              specsOnly,
              targetPercentile,
              leadTimeTargetPercentile,
              cycleTimeTargetPercentile,
              leadTimeTarget,
              cycleTimeTarget,
              wipLimit,
              viewerContext
            }
          }
        />
      );
  }
});

export function WorkInProgressSummaryView({
  pipelineCycleMetrics,
  cycleTimeTarget,
  specsOnly,
  quadrantSummaryPanel
}) {
  const intl = useIntl();

  //TODO: make sure all the targets are correct?
  const items = pipelineCycleMetrics[specsOnly ? "workItemsWithCommits" : "workItemsInScope"]
  // const avgAge = getMetricUtils({
  //   target: cycleTimeTarget,
  //   value: pipelineCycleMetrics["avgCycleTime"],
  //   uom: "Days",
  //   good: TrendIndicator.isNegative,
  //   precision: pipelineCycleMetrics["avgCycleTime"] > 10 ? 1 : 2,
  //   valueRender: (text) => text,
  // });
  const codeWip = getMetricUtils({
    target: cycleTimeTarget,
    value: pipelineCycleMetrics["totalEffort"],
    uom: "FTE Days",
    good: TrendIndicator.isNegative,
    precision: pipelineCycleMetrics["totalEffort"] > 10 ? 1 : 2,
    valueRender: (text) => text,
  });
  const cycleTime = getMetricUtils({
    target: cycleTimeTarget,
    value: pipelineCycleMetrics["cycleTime"],
    uom: "Days",
    good: TrendIndicator.isNegative,
    precision: pipelineCycleMetrics["cycleTime"] > 10 ? 1 : 2,
    valueRender: (text) => text,
  });
  
  // const commitLatency = getMetricUtils({
  //   target: cycleTimeTarget,
  //   value: pipelineCycleMetrics["avgLatency"],
  //   uom: "Days",
  //   good: TrendIndicator.isNegative,
  //   precision: pipelineCycleMetrics["avgLatency"] > 10 ? 1 : 2,
  //   valueRender: (text) => text,
  // });
  // const pRAgeDisplay = humanizeDuration(i18nNumber(intl, pipelineCycleMetrics["avgPullRequestsAge"], 2));

  return (
    <div className="tw-grid tw-grid-cols-6 tw-gap-2 tw-h-full">
      <MetricCard title={"Wip"} value={items} uom={specsOnly ? "Specs": "Cards"} />
      {/* <MultipleMetricsCard metrics={[{title: "Avg. Age:", value: avgAge.metricValue, uom: avgAge.suffix}, {title: "Cycle Time:", value: cycleTime.metricValue, uom: cycleTime.suffix}]}/> */}
      {/* <div className="tw-col-span-2 tw-rounded-lg tw-border tw-border-solid tw-border-gray-100 tw-bg-white tw-p-1 tw-shadow-md tw-h-full tw-flex tw-items-center">
        {quadrantSummaryPanel}
      </div> */}
      {/* <MultipleMetricsCard metrics={[{title: "Code Wip", value: codeWip.metricValue, uom: codeWip.suffix}, {title: "Commit Latency", value: commitLatency.metricValue, uom: commitLatency.suffix}]}/> */}
      {/* <MetricCard title={"PR Age"} value={pRAgeDisplay} uom={""} /> */}
    </div>
  );
}

export const WipFlowMetricsSummaryView = withNavigationContext(PipelineSummaryView);