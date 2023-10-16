import React from "react";
import { useIntl } from "react-intl";
import {AvgAge, Wip} from "../../../../components/flowStatistics/flowStatistics";
import {DevItemRatio, useWipMetricsCommon} from "../../clientSideFlowMetrics";
import { getPercentage } from "../../../../../projects/shared/helper/utils";


export function DimensionWipMetricsView({wipDataAll, flowMetricsData, dimension, displayBag, excludeMotionless, cycleTimeTarget, latencyTarget, specsOnly, days}) {
  const intl = useIntl();

  const {wipLimit, motionLimit, pipelineCycleMetrics, workItemAggregateDurationsForSpecs, workItemAggregateDurations, specEpicsCount, epicsCount} =
    useWipMetricsCommon({
      wipDataAll,
      flowMetricsData,
      dimension,
      specsOnly,
      days,
      excludeMotionless,
      cycleTimeTarget,
      latencyTarget,
    });

  const {displayType, metric, displayProps} = displayBag;

  const bottomRightView = specsOnly
    ?  {
      bottomRightView: {
        bottomRightElement: displayBag?.traceabilityStat,
        title: null,
        content: displayBag?.traceability,
        placement: "top",
      },
    }
    : {
        bottomRightView: {
          bottomRightElement: (
            <DevItemRatio
              devItemsCount={workItemAggregateDurationsForSpecs.length}
              devItemsPercentage={getPercentage(
                workItemAggregateDurations.length > 0
                  ? workItemAggregateDurationsForSpecs.length / workItemAggregateDurations.length
                  : 0,
                intl
              )}
            />
          ),
          title: null,
          content: displayBag?.traceability,
          placement: "top",
        },
      };

  const metricMap = {
    volume: (
      <Wip
        title={
          <div className="tw-flex tw-flex-col">
            <div>Work In Process (WIP)</div>
            <div className="tw-text-base">{specsOnly ? specEpicsCount : epicsCount} Epics</div>
          </div>
        }
        currentMeasurement={pipelineCycleMetrics}
        specsOnly={specsOnly}
        target={wipLimit}
        displayType={displayType}
        displayProps={{
          className: "tw-p-2",
          supportingMetric: <span>Limit {wipLimit}</span>,
          ...bottomRightView,
          info: {title: "Info", content: "content"},
          ...displayProps,
          midTarget: motionLimit,
        }}
      />
    ),
    avgAge: (
      <AvgAge
        title={
          <span>
            WIP Age<sup> Avg</sup>
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
