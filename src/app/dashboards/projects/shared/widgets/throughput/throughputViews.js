import {AvgAge, Cadence, Throughput, Volume} from "../../../../shared/components/flowStatistics/flowStatistics";
import {VolumeTrendsChart} from "../../../../shared/widgets/work_items/trends/volume/volumeTrendsChart";
import {ThroughputDetailDashboard} from "./throughputDetailDashboard";
import {ThroughputTrendsWidget} from "./throughputTrendsWidget";

export function ThroughputTrendsView({data, dimension, measurementPeriod, measurementWindow, specsOnly, view}) {
  const {cycleMetricsTrends: flowMetricsTrends} = data[dimension];

  return (
    <div className="tw-h-full tw-w-full tw-border tw-border-solid tw-border-gray-300">
      <VolumeTrendsChart
        flowMetricsTrends={flowMetricsTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        view={view}
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
  currentTrend = {...currentTrend, measurementWindow: flowAnalysisPeriod};
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
          subTitle: <span>Last {flowAnalysisPeriod} Days</span>,
          detailsView: {
            title: (
              <div className="tw-text-lg tw-text-gray-300">
                Throughput Details{" "}
                <span className="tw-text-base tw-italic">All Cards, Last {flowAnalysisPeriod} Days</span>
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
            placement: "right",
          },
          trendsView: {
            title: "",
            content: (
              <ThroughputTrendsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                flowAnalysisPeriod={flowAnalysisPeriod}
                targetPercentile={targetPercentile}
                includeSubTasks={includeSubTasks}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                specsOnly={specsOnly}
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

export function VolumeCardView({data, dimension, displayType, flowAnalysisPeriod, specsOnly, displayProps={}}) {
  const {cycleMetricsTrends} = data[dimension];
  let [currentTrend, previousTrend] = cycleMetricsTrends;
  currentTrend = {...currentTrend, measurementWindow: flowAnalysisPeriod};
  return (
    <div className="tw-h-full tw-w-full">
      <Volume
        displayType={displayType}
        normalized={false}
        displayProps={{
          className: "tw-p-2",
          info: {title: "title"},
          ...displayProps
        }}
        specsOnly={specsOnly}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        measurementWindow={flowAnalysisPeriod}
      />
    </div>
  );
}

export function AgeCardView({data, dimension, displayType, flowAnalysisPeriod, displayProps={}, cycleTimeTarget}) {
  const {cycleMetricsTrends} = data[dimension];
  let [currentTrend, previousTrend] = cycleMetricsTrends;
  currentTrend = {...currentTrend, measurementWindow: flowAnalysisPeriod};
  return (
    <div className="tw-h-full tw-w-full">
      <AvgAge
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          info: {title: "title"},
          ...displayProps
        }}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
        target={cycleTimeTarget}
      />
    </div>
  );
}

export function CadenceCardView({data, dimension, displayType, specsOnly}) {
  const {cycleMetricsTrends} = data[dimension];
  let [currentTrend, previousTrend] = cycleMetricsTrends;

  return (
    <div className="tw-h-full tw-w-full">
      <Cadence
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          info: {title: "title"},
        }}
        specsOnly={specsOnly}
        currentMeasurement={currentTrend}
        previousMeasurement={previousTrend}
      />
    </div>
  );
}
