import React from "react";
// import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../containers/layout";
// import {useGenerateTicks} from "../../../../hooks/useGenerateTicks";
// import {EVENT_TYPES, useBlurClass} from "../../../../../../helpers/utility";
// import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import { FlowEfficiencyQuadrantSummaryCard } from "./flowEfficiencyQuadrantSummaryCard";
import { QuadrantSummaryPanel } from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import { getWorkItemDurations } from "../../clientSideFlowMetrics";
import { projectDeliveryCycleFlowMetricsMeta } from "../../../../helpers/metricsMeta";
import { getHistogramSeries } from "../../../../../projects/shared/helper/utils";
import { ResponseTimeMetricsColor } from "../../../../config";
import { useIntl } from "react-intl";

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
  // const blurClass = useBlurClass();
  // const tick = useGenerateTicks(2, 60000);
  const intl = useIntl();

  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);


  const seriesData = React.useMemo(() => {
    const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
      stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
    );

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
  }, [workItems, stateTypes, intl]);

  // const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div className="tw-h-[77%]">
          {/* <WorkItemsCycleTimeVsLatencyChart
            view={view}
            stageName={stageName}
            specsOnly={specsOnly}
            workItems={workItems}
            stateTypes={stateTypes}
            groupByState={groupByState}
            cycleTimeTarget={cycleTimeTarget}
            latencyTarget={latencyTarget}
            tick={tick}
            tooltipType={tooltipType}
            blurClass={blurClass}
            onSelectionChange={(workItems, eventType) => {
              if (eventType === EVENT_TYPES.POINT_CLICK) {
                setWorkItemKey(workItems[0].key);
                setShowPanel(true);
              }
            }}
          /> */}
          <WorkItemsDetailHistogramChart
            chartSubTitle={"Subtitle"}
            
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
        {/* <CardInspectorWithDrawer
          workItemKey={workItemKey}
          context={context}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          drawerOptions={{placement: "bottom"}}
        /> */}
      </VizItem>
    </VizRow>
  );
};
