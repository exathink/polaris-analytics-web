import { VolumeWithThroughput } from "../../../../shared/components/flowStatistics/flowStatistics";
import { AppTerms } from "../../../../shared/config";
import {CycleTimeCardView} from "../responseTimeSLA/cycleTimeCardView";
import {ThroughputDetailDashboard} from "../throughput/throughputDetailDashboard";
import {ThroughputCardView, VolumeCardView} from "../throughput/throughputViews";

export function FlowMetricsView({
  data,
  dimension,
  instanceKey,
  displayBag,
  flowAnalysisPeriod,
  trendAnalysisPeriod,
  targetPercentile,
  cycleTimeTarget,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,
  includeSubTasks,
  view,
}) {
  const {metric, displayType, iconsShiftLeft, ...displayProps} = displayBag;
  const {cycleMetricsTrends} = data[dimension];
  let [currentTrend, previousTrend] = cycleMetricsTrends;

  const metricMap = {
    throughput:
      view === "detail" ? (
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
          displayBag={{classNameForFirstCard: "tw-w-full", className: "tw-w-[98%] tw-grid-rows-[20%_80%]"}}
        />
      ) : (
        <ThroughputCardView
          data={data}
          dimension={dimension}
          instanceKey={instanceKey}
          displayType={displayType}
          displayProps={{iconsShiftLeft, ...displayProps}}
          flowAnalysisPeriod={flowAnalysisPeriod}
          trendAnalysisPeriod={trendAnalysisPeriod}
          specsOnly={specsOnly}
          latestCommit={latestCommit}
          latestWorkItemEvent={latestWorkItemEvent}
          includeSubTasks={includeSubTasks}
          targetPercentile={targetPercentile}
        />
      ),
    volumeWithThroughput: (
      <VolumeWithThroughput
        title={"Volume"}
        displayType={displayType}
        displayProps={{
          info: {title: "title"},
          subTitle: <span>Last {flowAnalysisPeriod} Days</span>,
          detailsView: {
            title: (
              <div className="tw-text-lg tw-text-gray-300">
                Volume Details{" "}
                <span className="tw-text-base tw-italic">
                  {specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}, Last {flowAnalysisPeriod} Days
                </span>
              </div>
            ),
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
                displayBag={{classNameForFirstCard: "tw-w-[16rem]"}}
              />
            ),
            placement: "top",
          },
          trendsView: {
            title: "",
            content: (
              <VolumeWithThroughput
                title={<span>Volume</span>}
                displayType={"trendsCompareCard"}
                displayProps={{measurementWindow: flowAnalysisPeriod}}
                currentMeasurement={currentTrend}
                previousMeasurement={previousTrend}
                specsOnly={specsOnly}
                measurementWindow={flowAnalysisPeriod}
              />
            ),
            placement: "top",
          },
          ...displayProps,
        }}
        currentMeasurement={{...currentTrend, measurementWindow: flowAnalysisPeriod}}
        previousMeasurement={previousTrend}
        specsOnly={specsOnly}
        measurementWindow={flowAnalysisPeriod}
      />
    ),
    cycleTime: (
      <CycleTimeCardView
        data={data}
        dimension={dimension}
        instanceKey={instanceKey}
        displayType={displayType}
        displayProps={displayProps}
        flowAnalysisPeriod={flowAnalysisPeriod}
        trendAnalysisPeriod={trendAnalysisPeriod}
        specsOnly={specsOnly}
        latestCommit={latestCommit}
        latestWorkItemEvent={latestWorkItemEvent}
        includeSubTasks={includeSubTasks}
        targetPercentile={targetPercentile}
        cycleTimeTarget={cycleTimeTarget}
      />
    ),
    volume: (
      <VolumeCardView
        data={data}
        dimension={dimension}
        displayType={displayType}
        displayProps={displayProps}
        flowAnalysisPeriod={flowAnalysisPeriod}
        specsOnly={specsOnly}
      />
    ),
  };
  const metricViewElement = metricMap[metric];
  return <div className="tw-h-full tw-w-full">{metricViewElement}</div>;
}
