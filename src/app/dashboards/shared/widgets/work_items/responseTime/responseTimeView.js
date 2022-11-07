import classNames from "classnames";
import React from "react";
import {
  AvgCycleTime,
  AvgDuration,
  AvgLatency,
  AvgLeadTime,
  FlowEfficiency
} from "../../../components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../containers/layout";
import fontStyles from "../../../../../framework/styles/fonts.module.css";
import { AppTerms } from "../../../config";

export const ResponseTimeView = ({cycleMetricsTrends, cycleTimeTarget, leadTimeTarget, display, specsOnly, days}) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }

  switch (display) {
    case "responseTimeSummary": {
      return (
        <VizRow>
          <VizItem w={1 / 3}>
            <AvgCycleTime currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          </VizItem>
          <VizItem w={1 / 3}>
            <AvgDuration currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          </VizItem>
          <VizItem w={1 / 3}>
            <AvgLatency currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          </VizItem>
        </VizRow>
      );
    }
    case "leadAndCycleTimeSummary": {
      return (
        <VizRow>
          <VizItem w={1 / 3}>
            <AvgLeadTime currentMeasurement={current} previousMeasurement={previous} target={leadTimeTarget} />
          </VizItem>
          <VizItem w={1 / 2}>
            <AvgCycleTime currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          </VizItem>
        </VizRow>
      );
    }
    case "leadCycleTimeFlowEfficiencySummary": {
      return (
        <VizRow>
          <VizItem w={1 / 3}>
            <AvgLeadTime currentMeasurement={current} previousMeasurement={previous} target={leadTimeTarget} />
          </VizItem>
          <VizItem w={1 / 3}>
            <AvgCycleTime currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          </VizItem>
          <VizItem w={1 / 3}>
            <FlowEfficiency currentMeasurement={current} previousMeasurement={previous} target={70} />
          </VizItem>
        </VizRow>
      );
    }
    case "pullRequestsFlowMetricsSummary": {
      const itemsLabel = specsOnly ? AppTerms.specs.display : AppTerms.cards.display;
      // as we dont want to show compared to text.
      const currentTrend = {...current, samplingFrequency: undefined, measurementWindow: undefined}

      return (
        <div className="tw-grid tw-h-full tw-grid-cols-2 tw-grid-rows-[auto_80%] tw-gap-1">
          <div className={classNames("tw-col-span-2 tw-font-normal", fontStyles["text-lg"])}>
            Closed
            <span className={classNames(fontStyles["text-xs"], "tw-ml-2")}>
              {itemsLabel}, Last {days} Days
            </span>
          </div>
          <AvgCycleTime
            displayType={"card"}
            displayProps={{className: "tw-p-2"}}
            currentMeasurement={currentTrend}
            previousMeasurement={previous}
            target={cycleTimeTarget}
          />
          <AvgDuration
            displayType={"card"}
            displayProps={{className: "tw-p-2"}}
            currentMeasurement={currentTrend}
            previousMeasurement={previous}
            target={cycleTimeTarget}
          />
        </div>
      );
    }
    default: {
      return "Error: A valid value for required prop 'display' was not provided";
    }
  }
};
