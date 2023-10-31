/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import {StartRate} from "../../../../shared/components/flowStatistics/flowStatistics";

function getGoodnessIndicator(currentThroughputTrend, currentArrivalTrend, specsOnly) {
    const START_RATE_THRESHOLD = 5;
    const departures = specsOnly ? currentThroughputTrend["workItemsWithCommits"] : currentThroughputTrend["workItemsInScope"];
    const arrivals = currentArrivalTrend['arrivals'];
    if (arrivals > 0) {
      // good means that the departure rate is within threshold % of the arrival rate.
      return (Math.abs(arrivals - departures) / arrivals)*100 < START_RATE_THRESHOLD;
    } else {
      return true
    }
}

export function StartRateView({
  arrivalDepartureTrends,
  cycleMetricsTrends,
  flowAnalysisPeriod,
  specsOnly,
  displayType,
  displayProps,
}) {
  let [currentArrivalTrend, previousArrivalTrend] = arrivalDepartureTrends;
  let [currentThroughputTrend] = cycleMetricsTrends;
  const dummy_target = 2;
  const startRate = currentArrivalTrend["arrivals"] ? currentArrivalTrend["arrivals"] / flowAnalysisPeriod : null;
  const supportingMetric = currentArrivalTrend["arrivals"] ? <span>Start Rate: {startRate.toFixed(1)} / day</span> : <span></span>;
  return (
    <div className="tw-h-full tw-w-full">
      <StartRate
        currentMeasurement={currentArrivalTrend}
        previousMeasurement={previousArrivalTrend}
        displayType={displayType}
        specsOnly={specsOnly}
        target={dummy_target}
        // explicitly setting this to false since we need to figure out a better mechanism for goodness indicator here.
        good={false}
        // explicity passing a function to evaluate the goodness of value since we are not passing goodness of trend.
        valueGood={()=> getGoodnessIndicator(currentThroughputTrend, currentArrivalTrend, specsOnly)}
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
