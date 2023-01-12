import React from "react";
import {VizItem, VizRow} from "../../../../containers/layout";
import { FlowEfficiencyQuadrantSummaryCard } from "./flowEfficiencyQuadrantSummaryCard";
import { QuadrantSummaryPanel } from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import { getWorkItemDurations } from "../../clientSideFlowMetrics";
import { projectDeliveryCycleFlowMetricsMeta } from "../../../../helpers/metricsMeta";
import { getHistogramSeries } from "../../../../../projects/shared/helper/utils";
import { ResponseTimeMetricsColor } from "../../../../config";
import { useIntl } from "react-intl";
import {getTitle} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";

const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export const DimensionCycleTimeLatencyView = ({
  dimension,
  stageName,
  data,
  stateTypes,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  specsOnly,
  tooltipType,
  view,
  context,
  displayBag={}
}) => {
  const intl = useIntl();

  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
    stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
  );
 
  const seriesData = React.useMemo(() => {
    const points = workItemsWithAggregateDurations
      .filter((cycle) => cycle.workItemType !== "epic")
      .map((cycle) => projectDeliveryCycleFlowMetricsMeta["age"].value(cycle));

    const seriesObj = getHistogramSeries({
      id: "age",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      name: projectDeliveryCycleFlowMetricsMeta["age"].display,
      points,
      color: ResponseTimeMetricsColor.age,
    });

    return [seriesObj];
  }, [workItemsWithAggregateDurations, intl]);

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div className="tw-h-[77%]">
          <WorkItemsDetailHistogramChart
            chartConfig={{
              title: getTitle({workItems: workItemsWithAggregateDurations, stageName, specsOnly}),
              xAxisTitle: "Age in Days",
              subtitle: "Chart SubTitle",
            }}
            selectedMetric={"age"}
            specsOnly={specsOnly}
            colWidthBoundaries={COL_WIDTH_BOUNDARIES}
            stateType={"deliver"}
            series={seriesData}
          />
        </div>
        <div className={`tw-flex tw-h-[23%] tw-items-center tw-bg-chart`}>
          {displayBag?.displayType === "FlowEfficiencyCard" ? (
            <FlowEfficiencyQuadrantSummaryCard
              workItems={workItems}
              stateTypes={stateTypes}
              specsOnly={specsOnly}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              className="tw-mx-auto tw-w-[98%]"
            />
          ) : (
            <QuadrantSummaryPanel
              workItems={workItems}
              stateTypes={stateTypes}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              className="tw-mx-auto tw-w-[98%]"
              size={displayBag?.summaryPanelSize}
              valueFontClass={displayBag?.summaryPanelValueFontSize}
            />
          )}
        </div>
      </VizItem>
    </VizRow>
  );
};
