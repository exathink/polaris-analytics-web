import React from "react";
import { useIntl } from "react-intl";
import {AvgAge, Wip} from "../../../../components/flowStatistics/flowStatistics";
import {DevItemRatio, useWipMetricsCommon} from "../../clientSideFlowMetrics";
import { getPercentage } from "../../../../../projects/shared/helper/utils";


export function DimensionWipMetricsView({data, dataForSpecs, flowMetricsData, dimension, displayBag, excludeAbandoned, cycleTimeTarget, latencyTarget, specsOnly, days}) {
  const intl = useIntl();

  const {wipLimit, pipelineCycleMetrics, workItemAggregateDurationsForSpecs, workItemAggregateDurations} =
    useWipMetricsCommon({
      data,
      dataForSpecs,
      flowMetricsData,
      dimension,
      specsOnly,
      days,
      excludeAbandoned,
      cycleTimeTarget,
      latencyTarget,
    });

  const {displayType, metric, displayProps} = displayBag;

  const bottomRightElement = specsOnly ? {} : {bottomRightElement: (
    <DevItemRatio
      devItemsCount={workItemAggregateDurationsForSpecs.length}
      devItemsPercentage={getPercentage(
        workItemAggregateDurations.length > 0
          ? workItemAggregateDurationsForSpecs.length / workItemAggregateDurations.length
          : 0,
        intl
      )}
    />
  )};

  const metricMap = {
    volume: (
      <Wip
        title={<span>Work In Process: Total</span>}
        currentMeasurement={pipelineCycleMetrics}
        specsOnly={specsOnly}
        target={wipLimit}
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          supportingMetric: <span>Limit {wipLimit}</span>,
          ...bottomRightElement,
          info: {title: "Info", content: "content"},
          ...displayProps,
        }}
      />
    ),
    avgAge: (
      <AvgAge
        title={
          <span>
            Work In Process: Age <sup>Avg</sup>
          </span>
        }
        currentMeasurement={pipelineCycleMetrics}
        target={cycleTimeTarget}
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          supportingMetric: <span>Target {cycleTimeTarget} Days</span>,
          trendsView: {title: "Age", content: <span>Trends</span>},
          info: {title: "Info", content: "content"},
          ...displayProps,
        }}
      />
    ),
  };

  // get the correct view component
  const metricViewElement = metricMap[metric];

  return <div className="tw-h-full tw-w-full">{metricViewElement}</div>;
}
