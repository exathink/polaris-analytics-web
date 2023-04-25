import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {FlowEfficiencyQuadrantSummaryCard} from "./flowEfficiencyQuadrantSummaryCard";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import {AppTerms, WorkItemStateTypes} from "../../../../config";
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
  QueueSizeFilterWrapper,
  getFilterValue,
  FILTERS,
  filterFns,
  getFilteredData
} from "./cycleTimeLatencyUtils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useGenerateTicks} from "../../../../hooks/useGenerateTicks";
import {AGE_LATENCY_ENHANCEMENTS} from "../../../../../../../config/featureFlags";
import {useWidget} from "../../../../../../framework/viz/dashboard/widgetCore";
import {WipQueueSizeChart} from "../../../../charts/workItemCharts/wipQueueSizeChart";

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

  const blurClass = useBlurClass();
  const tick = useGenerateTicks(2, 60000);

  // maintain all filters state over here
  const [appliedFilters, setAppliedFilters] = React.useState(new Map());
  const chart_category = stateTypes.includes(WorkItemStateTypes.deliver) ? "delivery" : "engineering";

  // chart related state
  const [selectedQuadrant] = getFilterValue(appliedFilters, FILTERS.QUADRANT_PANEL);
  const [chartCategory] = getFilterValue(appliedFilters, FILTERS.PRIMARY_CATEGORY);
  const [currentInteraction, secondaryData] = getFilterValue(appliedFilters, FILTERS.CURRENT_INTERACTION);

  // Update the state filter based on exclude flag
  filterFns[FILTERS.STATE] = (w, [selectedState]) => {
    return selectedState.value === undefined || selectedState.value === w.state;
  };

  const initWorkItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  function handleResetAll() {
    setAppliedFilters(new Map());
    displayBag?.setWipChartType("queue");
  }

  function handleQuadrantClear() {
    appliedFilters.delete(FILTERS.QUADRANT_PANEL);
    appliedFilters.delete(FILTERS.CURRENT_INTERACTION);
    appliedFilters.delete(FILTERS.PRIMARY_CATEGORY);

    setAppliedFilters(new Map(appliedFilters));
  }

  function handleQueueClearClick() {
    appliedFilters.delete(FILTERS.CURRENT_INTERACTION);
    appliedFilters.delete(FILTERS.PRIMARY_CATEGORY);
    appliedFilters.delete(FILTERS.STATE);
    setAppliedFilters(new Map(appliedFilters));

    displayBag?.setWipChartType("queue");
  }

  function handleAgeClearClick() {
    appliedFilters.delete(FILTERS.CURRENT_INTERACTION);
    appliedFilters.delete(FILTERS.PRIMARY_CATEGORY);

    displayBag?.setWipChartType("age");

    // remove age, currentInteraction, category filter
    setAppliedFilters(new Map(appliedFilters));
  }

  const initTransformedData = getWorkItemDurations(initWorkItems)
    .map((w) => ({
      ...w,
      quadrant: getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget),
    }))
    .filter((w) => stateTypes.indexOf(w.stateType) !== -1);

  // this data is always up-to-date with all the applied filters
  const latestData = getFilteredData({
    initData: initTransformedData,
    appliedFilters,
    filterFns,
  });

  const seriesData = useCycleTimeLatencyHook(latestData);
  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);

  let histogramElement = (
    <WorkItemsDetailHistogramChart
      chartConfig={{
        title: getTitleForHistogram({workItems: latestData, specsOnly, stageName}),
        align: {align: "left"},
        subtitle: getSubTitleForHistogram({workItems: latestData, specsOnly, intl}),
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
        setAppliedFilters((prev) => {
          return new Map(
            prev
              .set(FILTERS.PRIMARY_CATEGORY, [chart_category])
              .set(FILTERS.CURRENT_INTERACTION, ["histogram", {histogramBucket: category, selectedChartData: bucket}])
          );
        });
        displayBag?.setWipChartType("motion");
      }}
    />
  );

  let chartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={stageName}
      specsOnly={specsOnly}
      workItems={latestData}
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

  const flowEfficiencyQuadrantSummaryElement = (
    <FlowEfficiencyQuadrantSummaryCard
      workItems={initWorkItems}
      stateTypes={stateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      className="tw-mx-auto tw-w-[98%]"
      onQuadrantClick={(quadrant) => {
        if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && chartCategory === stageName) {
          handleQuadrantClear();
        } else {
          setAppliedFilters((prev) => {
            return new Map(
              prev
                .set(FILTERS.QUADRANT_PANEL, [quadrant])
                .set(FILTERS.PRIMARY_CATEGORY, [chart_category])
                .set(FILTERS.CURRENT_INTERACTION, ["quadrant"])
            );
          });
        }
      }}
      selectedQuadrant={selectedQuadrant}
    />
  );

  let quadrantSummaryElement = (
    <div className={`tw-flex tw-h-[23%] tw-items-center tw-bg-chart`}>
      {displayBag?.displayType === "FlowEfficiencyCard" ? (
        flowEfficiencyQuadrantSummaryElement
      ) : (
        <QuadrantSummaryPanel
          workItems={initWorkItems}
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
    const flowEfficiencyElement = React.cloneElement(flowEfficiencyQuadrantSummaryElement, {
      onQuadrantClick: undefined,
    });

    let selectedFilter = "";
    if (currentInteraction === "histogram") {
      selectedFilter = secondaryData.histogramBucket;
    }
    if (currentInteraction === "queuesize") {
      selectedFilter = appliedFilters.get(FILTERS.STATE)[0].value;
    }

    const ageFilterElement = (
      <AgeFilterWrapper selectedFilter={selectedFilter} handleClearClick={handleAgeClearClick} />
    );
    const quadrantFilterElement = selectedQuadrant && (
      <QuadrantFilterWrapper
        selectedQuadrant={QuadrantNames[selectedQuadrant]}
        selectedFilter={getQuadrantDescription({intl, cycleTimeTarget, latencyTarget})[selectedQuadrant]}
        handleClearClick={handleResetAll}
      />
    );
    const queueSizeFilterElement = (
      <QueueSizeFilterWrapper selectedFilter={selectedFilter} handleClearClick={handleQueueClearClick} />
    );

    let filterElement;
    if (currentInteraction === "histogram") {
      filterElement = ageFilterElement;
    }

    if (currentInteraction === "queuesize") {
      filterElement = queueSizeFilterElement;
    }

    // wipChartType 'queue', 'age', 'motion'
    if (displayBag?.wipChartType === "queue") {
      const queueSizeElement = (
        <WipQueueSizeChart
          items={latestData}
          stageName={stageName}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            setAppliedFilters((prev) => {
              return new Map(
                prev
                  .set(FILTERS.PRIMARY_CATEGORY, [chart_category])
                  .set(FILTERS.CURRENT_INTERACTION, ["queuesize"])
                  .set(FILTERS.STATE, [{value: obj.options.name, label: obj.options.name}])
              );
            });
            displayBag?.setWipChartType("age");
          }}
        />
      );

      // chartState.chartClicked === null && chartState.selectedCategory == null
      chartElement = (
        <div className="tw-relative tw-h-full">
          {queueSizeElement} {filterElement}
        </div>
      );
    }

    if (displayBag?.wipChartType === "age") {
      chartElement = (
        <div className="tw-relative tw-h-full">
          {histogramElement} {filterElement}
        </div>
      );
    }

    if (displayBag?.wipChartType === "motion") {
      chartElement = (
        <div className="tw-relative tw-h-full">
          {originalChartElement}
          {quadrantFilterElement}
          {filterElement}
        </div>
      );
    }

    if (displayBag?.wipChartType !== "motion") {
      quadrantSummaryElement = null;
    }
  }

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div
          className={
            displayBag?.wipChartType === "motion" || !ageLatencyFeatureFlag || currentInteraction === "histogram"
              ? "tw-relative tw-h-[77%]"
              : "tw-h-full"
          }
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
