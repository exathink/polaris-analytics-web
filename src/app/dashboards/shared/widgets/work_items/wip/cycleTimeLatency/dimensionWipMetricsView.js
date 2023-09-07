import React from "react";
import { useIntl } from "react-intl";
import { average, i18nNumber } from "../../../../../../helpers/utility";
import {AvgAge, Wip} from "../../../../components/flowStatistics/flowStatistics";
import {getWipLimit, getWorkItemDurations} from "../../clientSideFlowMetrics";
import { Quadrants, getQuadrant } from "./cycleTimeLatencyUtils";
import { getPercentage } from "../../../../../projects/shared/helper/utils";

function DevItemRatio({devItemsCount, devItemsPercentage}) {
  return (
    <div className="tw-textXl tw-flex tw-flex-col">
      <div className="tw-flex tw-items-center tw-gap-2">
        <div>{devItemsCount}</div>
        <div className="tw-textSm">{devItemsCount===1 ? "Dev Item": "Dev Items"}</div>
      </div>
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-textSm">Dev Item Ratio</div>
        <div>{devItemsPercentage}</div>
      </div>
    </div>
  );
}

export function DimensionWipMetricsView({data, dataForSpecs, flowMetricsData, dimension, displayBag, excludeAbandoned, cycleTimeTarget, latencyTarget, specsOnly, days}) {
  const intl = useIntl();

  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);
  const workItemAggregateDurations = excludeAbandoned
    ? getWorkItemDurations(workItems).filter((w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) !== Quadrants.abandoned)
    : getWorkItemDurations(workItems);

    const workItemsForSpecs = React.useMemo(() => {
      const edges = dataForSpecs?.[dimension]?.["workItems"]?.["edges"] ?? [];
      return edges.map((edge) => edge.node);
    }, [dataForSpecs, dimension]);

    const workItemAggregateDurationsForSpecs = excludeAbandoned
      ? getWorkItemDurations(workItemsForSpecs).filter(
          (w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) !== Quadrants.abandoned
        )
      : getWorkItemDurations(workItemsForSpecs);

  const avgCycleTime = average(workItemAggregateDurations, (item) => item.cycleTime);

  const pipelineCycleMetrics = {
    [specsOnly ? "workItemsWithCommits" : "workItemsInScope"]: workItemAggregateDurations.length,
    avgCycleTime: i18nNumber(intl, avgCycleTime, 2),
  };

  const {displayType, metric, displayProps} = displayBag;
  
  const wipLimit = getWipLimit({flowMetricsData, dimension, specsOnly, intl, cycleTimeTarget, days});

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
