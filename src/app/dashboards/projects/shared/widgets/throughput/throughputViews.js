import {AvgAge, Cadence, Throughput, Volume} from "../../../../shared/components/flowStatistics/flowStatistics";
import {VolumeTrendsChart} from "../../../../shared/widgets/work_items/trends/volume/volumeTrendsChart";
import { TrendsDetail } from "../../components/TrendsDetail";
import {ThroughputDetailDashboard} from "./throughputDetailDashboard";
import {ThroughputTrendsWidget} from "./throughputTrendsWidget";

export function ThroughputTrendsView({data, dimension, measurementPeriod, measurementWindow, specsOnly, view, displayBag}) {
  const {cycleMetricsTrends: flowMetricsTrends} = data[dimension];

  if (displayBag?.displayType === "trendsCompareCard") {
    const [currentTrend, prevTrend] = flowMetricsTrends;
    return (
      <TrendsDetail
        title={"Throughput"}
        comparedToText={`Compared to prior ${measurementWindow} days`}
        trendIndicator={"200% down"}
        prevPeriod={"30/04 to 29/08"}
        currentPeriod={"25/02 to 29/08"}
        prevValue={9.3}
        currentValue={6.4}
        uom={"Specs/day"}
      />
    );
  }
  return (
      <VolumeTrendsChart
        flowMetricsTrends={flowMetricsTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        view={view}
      />
  );
}

export function ThroughputCardView({
  data,
  dimension,
  displayType,
  displayProps,
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
            placement: "top",
          },
          trendsView: {
            title: "",
            content: (
              <ThroughputTrendsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                days={flowAnalysisPeriod}
                measurementWindow={flowAnalysisPeriod}
                samplingFrequency={flowAnalysisPeriod}
                targetPercentile={targetPercentile}
                includeSubTasks={includeSubTasks}
                latestCommit={latestCommit}
                latestWorkItemEvent={latestWorkItemEvent}
                specsOnly={specsOnly}
                displayBag={{displayType: "trendsCompareCard"}}
              />
            ),
            placement: "top",
          },
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
