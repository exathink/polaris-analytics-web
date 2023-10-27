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
  const startRate = currentArrivalTrend["arrivals"] ? currentArrivalTrend["arrivals"] / flowAnalysisPeriod : null;
  const supportingMetric = currentArrivalTrend["arrivals"] ? <span>Start Rate: {startRate} / day</span> : <span></span>;
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
