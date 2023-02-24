import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {FlowEfficiencyQuadrantSummaryCard} from "./flowEfficiencyQuadrantSummaryCard";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import {AppTerms} from "../../../../config";
import {useIntl} from "react-intl";
import {EVENT_TYPES, localNow, useBlurClass, useFeatureFlag} from "../../../../../../helpers/utility";
import {
  useCycleTimeLatencyHook,
  getSubTitleForHistogram,
  COL_WIDTH_BOUNDARIES,
  getTitleForHistogram,
  getTooltipForAgeLatency,
  AgeFilterWrapper,
  getQuadrant,
  QuadrantFilterWrapper,
  QuadrantNames,
  getQuadrantDescription,
} from "./cycleTimeLatencyUtils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useGenerateTicks} from "../../../../hooks/useGenerateTicks";
import {AGE_LATENCY_ENHANCEMENTS} from "../../../../../../../config/featureFlags";
import {useWidget} from "../../../../../../framework/viz/dashboard/widgetCore";
import { metricsMapping } from "../../../../helpers/teamUtils";
import { WipQueueSizeChart } from "../../../../charts/workItemCharts/wipQueueSizeChart";

export function getSubTitle({workItems, specsOnly, intl}) {
  const count = workItems.length;

  const countDisplay = `${count} ${
    count === 1
      ? specsOnly
        ? AppTerms.spec.display
        : AppTerms.card.display
      : specsOnly
      ? AppTerms.specs.display
      : AppTerms.cards.display
  }`;

  return `${countDisplay} as of ${localNow(intl)}`;
}

export const DimensionCycleTimeLatencyView = ({
  dimension,
  stageName,
  stateTypes,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  tooltipType,
  view,
  context,
  displayBag = {},
}) => {
  const intl = useIntl();
  const {
    data,
    variables: {specsOnly},
  } = useWidget();
  const [selectedFilter, setFilter] = React.useState();
  const [selectedCategory, setSelectedCategory] = React.useState();

  const blurClass = useBlurClass();
  const tick = useGenerateTicks(2, 60000);

  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const [selectedQuadrant, setSelectedQuadrant] = React.useState();
  const [quadrantStateType, setQuadrantStateType] = React.useState();

  const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
    stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
  );

  function handleResetAll() {
    setSelectedQuadrant(undefined);
    setQuadrantStateType(undefined);
    setFilter(undefined);
  }

  function handleClearClick() {
    setFilter(undefined);
    setSelectedCategory(undefined);
  }

  const seriesData = useCycleTimeLatencyHook(workItemsWithAggregateDurations);
  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);

  let chartElement = (
    <WorkItemsCycleTimeVsLatencyChart
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
    />
  );
  let quadrantSummaryElement = (
    <div className={`tw-flex tw-h-[23%] tw-items-center tw-bg-chart`}>
      {displayBag?.displayType === "FlowEfficiencyCard" ? (
        <FlowEfficiencyQuadrantSummaryCard
          workItems={workItems}
          stateTypes={stateTypes}
          specsOnly={specsOnly}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          className="tw-mx-auto tw-w-[98%]"
          onQuadrantClick={(quadrant) => {
            if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && quadrantStateType === stageName) {
              handleResetAll();
            } else {
              const workItemsWithAggregateDurations = getWorkItemDurations(workItems)
                .filter((workItem) => (stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true))
                .filter(
                  (x) =>
                    quadrant === undefined ||
                    quadrant === getQuadrant(x.cycleTime, x.latency, cycleTimeTarget, latencyTarget)
                );

              setFilter?.(workItemsWithAggregateDurations);
              setSelectedQuadrant(quadrant);
              setQuadrantStateType(stageName);
            }
          }}
          selectedQuadrant={selectedQuadrant}
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
  );
  if (ageLatencyFeatureFlag) {
    const originalChartElement = chartElement;
    let latencyChartElement = React.cloneElement(chartElement, {workItems: selectedFilter});

    if (displayBag?.wipChartType === "latency") {
      chartElement = originalChartElement;
    }  else {
      chartElement = (
        <>
          {(selectedFilter !== undefined || displayBag?.wipChartType === "latency") && (
            <>
              {latencyChartElement}
              {!selectedQuadrant && (
                <AgeFilterWrapper selectedFilter={selectedCategory} handleClearClick={handleClearClick} />
              )}
              {selectedQuadrant && (
                <QuadrantFilterWrapper
                  selectedQuadrant={QuadrantNames[selectedQuadrant]}
                  selectedFilter={getQuadrantDescription({intl, cycleTimeTarget, latencyTarget})[selectedQuadrant]}
                  handleClearClick={handleResetAll}
                />
              )}
            </>
          )}

          {selectedFilter === undefined && (
            <div className="tw-relative tw-h-full">
              <WorkItemsDetailHistogramChart
                chartConfig={{
                  title: getTitleForHistogram({workItems: workItemsWithAggregateDurations, specsOnly, stageName}),
                  align: {align: "left"},
                  subtitle: getSubTitleForHistogram({workItems: workItemsWithAggregateDurations, specsOnly, intl}),
                  xAxisTitle: "Age in Days",
                  legendItemClick: () => {},
                  tooltip: getTooltipForAgeLatency,
                }}
                selectedMetric={"age"}
                specsOnly={specsOnly}
                colWidthBoundaries={COL_WIDTH_BOUNDARIES}
                stateType={"deliver"}
                series={seriesData}
                onPointClick={({options, category}) => {
                  const bucket = options.bucket;
                  setFilter?.(bucket);
                  setSelectedCategory(category);
                }}
              />
            </div>
          )}
        </>
      );
    }

    if(displayBag?.selectedMetric === metricsMapping.WIP_TOTAL) {
      chartElement = <WipQueueSizeChart items = {workItemsWithAggregateDurations} stageName={stageName} specsOnly={specsOnly}/>
    }

    quadrantSummaryElement =
      displayBag?.selectedMetric === metricsMapping.AVG_AGE && displayBag?.wipChartType === "latency"
        ? quadrantSummaryElement
        : null;
  }

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div
          className={(displayBag?.selectedMetric === metricsMapping.AVG_AGE && displayBag?.wipChartType==="latency") || !ageLatencyFeatureFlag ? "tw-relative tw-h-[77%]" : "tw-h-full"}
        >
          {chartElement}
        </div>
        {quadrantSummaryElement}
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          context={context}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          drawerOptions={{placement: "bottom"}}
        />
      </VizItem>
    </VizRow>
  );
};
