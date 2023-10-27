import {StartRate} from "../../../../shared/components/flowStatistics/flowStatistics";

export function StartRateView({
  arrivalDepartureTrends,
  measurementWindow,
  flowAnalysisPeriod,
  specsOnly,
  displayType,
  displayProps,
}) {
  let [currentArrivalTrend, previousArrivalTrend] = arrivalDepartureTrends;
  const startRate = currentArrivalTrend["arrivals"] / flowAnalysisPeriod;
  const supportingMetric = <span>Start Rate: {startRate}</span>;
  return (
    <div className="tw-h-full tw-w-full">
      <StartRate
        currentMeasurement={currentArrivalTrend}
        previousMeasurement={previousArrivalTrend}
        displayType={displayType}
        specsOnly={specsOnly}
        measurementWindow={measurementWindow}
        displayProps={{
          info: {title: "title"},
          subTitle: <span>Last {flowAnalysisPeriod} Days</span>,
          supportingMetric,
          trendsView: {
            title: "",
            content: (
              <StartRate
                title={<span>Start Rate</span>}
                displayType={"trendsCompareCard"}
                displayProps={{measurementWindow: flowAnalysisPeriod}}
                currentMeasurement={currentArrivalTrend}
                previousMeasurement={previousArrivalTrend}
              />
            ),
            placement: "top",
          },
          ...displayProps,
        }}
      />
    </div>
  );
}
