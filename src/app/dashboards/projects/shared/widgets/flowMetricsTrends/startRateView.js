/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */

import {StartRate} from "../../../../shared/components/flowStatistics/flowStatistics";
const START_RATE_THRESHOLD = 2;
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
        good={(delta) =>
          Math.abs(currentThroughputTrend["workItemsInScope"] - currentArrivalTrend["arrivals"]) < START_RATE_THRESHOLD
        }
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
