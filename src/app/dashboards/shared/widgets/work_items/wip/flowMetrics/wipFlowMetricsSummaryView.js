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
import {getItemSuffix, i18nNumber} from "../../../../../../helpers/utility";
import {useIntl} from "react-intl";

import grid from "../../../../../../framework/styles/grids.module.css";
import styles from "./flowMetrics.module.css";
import fontStyles from "../../../../../../framework/styles/fonts.module.css";
import classNames from "classnames";
import {VolumeTrendsChart} from "../../trends/volume/volumeTrendsChart";
import {ThroughputDetailDashboard} from "../../../../../projects/shared/widgets/throughput/throughputDetailDashboard";

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

// function ThroughputDetailsDashboard({}) {
//   return (
//     <div className="tw-grid tw-grid-cols-3 tw-gap-2 tw-text-lg">
//       <div className="tw-h-20 tw-border tw-border-solid tw-border-gray-300 tw-p-5">First Card</div>
//       <div className="tw-border tw-border-solid tw-border-gray-300 tw-p-5">Second Card</div>
//       <div className="tw-border tw-border-solid tw-border-gray-300 tw-p-5">Third Card</div>
//       <div className="tw-col-span-3 tw-mt-5 tw-h-[20rem] tw-w-[40rem] tw-border tw-border-solid tw-border-gray-300 tw-p-5">
//         Chart
//       </div>
//     </div>
//   );
// }

function ThroughputChart({flowMetricsTrends, measurementPeriod, measurementWindow, specsOnly}) {
  return (
    <div className="tw-h-full tw-w-[20rem] tw-border tw-border-solid tw-border-gray-300">
              <VolumeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          // chartConfig={chartConfig}
          // view={view}
          specsOnly={specsOnly}
        />
    </div>
  );
}

export function ThroughputCardView({
  data,
  dimension,
  displayType,
  instanceKey,
  flowAnalysisPeriod,
  trendAnalysisPeriod,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
  targetPercentile,
  includeSubTasks,
}) {
  const {cycleMetricsTrends} = data[dimension];
  let [currentTrend, previousTrend] = cycleMetricsTrends;

  return (
    <div className="tw-h-full tw-w-full">
      <Throughput
        title={
          <span>
            Throughput <sup>Avg</sup>
          </span>
        }
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          info: {title: "title"},
          detailsView: {
            title: "Throughput Detail Dashboard",
            content: (
              <ThroughputDetailDashboard
                dimension={dimension}
                instanceKey={instanceKey}
                flowAnalysisPeriod={flowAnalysisPeriod}
                trendAnalysisPeriod={trendAnalysisPeriod}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                targetPercentile={targetPercentile}
                specsOnly={specsOnly}
                includeSubTasks={includeSubTasks}
              />
            ),
            placement: "right",
          },
          trendsView: {
            title: "",
            content: (
              <ThroughputChart
                flowMetricsTrends={cycleMetricsTrends}
                measurementPeriod={trendAnalysisPeriod}
                measurementWindow={flowAnalysisPeriod}
                specsOnly={false}
              />
            ),
            placement: "bottom",
          },
        }}
        specsOnly={specsOnly}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        measurementWindow={flowAnalysisPeriod}
      />
    </div>
  );
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
      {/* TODO: this is only for testing purpose, will uncomment this */}
      {/* <Throughput
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
      /> */}
      {/* TODO: this is only for testing purpose, will remove it from here */}
      <ThroughputCardView
        data={data}
        dimension={dimension}
        days={days}
        measurementWindow={days}
        samplingFrequency={days}
        specsOnly={specsOnly}
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


  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-gap-1">
      <MetricsGroupTitle>Cost of Unshipped Code</MetricsGroupTitle>
      <TotalEffort 
        displayType="card"
        currentMeasurement={pipelineCycleMetrics}
        displayProps={{className: "tw-p-2", targetText: <span className="tw-invisible">random text</span>}}
      />
      <AvgLatency
        title={
          <span>
            Commit Latency
          </span>
        }
        displayType="card"
        currentMeasurement={pipelineCycleMetrics}
        displayProps={{className: "tw-p-2", targetText: <span className="tw-invisible">random text</span>}}
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

  return (
    <div className="tw-grid tw-h-full tw-grid-cols-2 tw-gap-1">
      <MetricsGroupTitle>Work in Progress</MetricsGroupTitle>
      <Wip 
        title={<span>Total</span>}
        currentMeasurement={pipelineCycleMetrics}
        specsOnly={specsOnly}
        target={wipLimit}
        displayType="card"
        displayProps={{className: "tw-p-2", targetText: <span>Limit {wipLimit}</span>}}
      />
      <AvgAge 
        currentMeasurement={pipelineCycleMetrics}
        target={cycleTimeTarget}
        displayType="card"
        displayProps={{className: "tw-p-2", targetText: <span>Target {cycleTimeTarget} Days</span>}}
      />
    </div>
  );
}
export const WipFlowMetricsSummaryView = withNavigationContext(PipelineSummaryView);
