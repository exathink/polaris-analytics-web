import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {MotionEfficiencyQuadrantSummaryCard} from "./motionEfficiencyQuadrantSummaryCard";
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
  getFilteredData, filterByStateTypes
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
  const {appliedFilters = new Map(), setAppliedFilters} = displayBag;
  const chart_category = stateTypes.includes(WorkItemStateTypes.deliver) ? "delivery" : "engineering";

  // chart related state
  const [selectedQuadrant] = getFilterValue(appliedFilters, FILTERS.QUADRANT_PANEL);
  const [chartCategory] = getFilterValue(appliedFilters, FILTERS.PRIMARY_CATEGORY);
  const [currentInteraction] = getFilterValue(appliedFilters, FILTERS.CURRENT_INTERACTION);
  const histogramBucket = appliedFilters.get(FILTERS.HISTOGRAM_BUCKET)?.histogramBucket;

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

  const initTransformedData = React.useMemo(() => getWorkItemDurations(initWorkItems).map((w) => ({
    ...w,
    quadrant: getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget),
  })), [initWorkItems, cycleTimeTarget, latencyTarget]);

  // const initTransformedData = initialData.filter((w) => stateTypes.indexOf(w.stateType) !== -1);

  // this data is always up-to-date with all the applied filters
  const latestData =
    chartCategory == null || chartCategory === chart_category
      ? getFilteredData({
          initData: initTransformedData,
          appliedFilters,
          filterFns,
        })
      : [];

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
              .set(FILTERS.PRIMARY_CATEGORY, {value: [chart_category]})
              .set(FILTERS.CURRENT_INTERACTION, {value: ["histogram"]})
              .set(FILTERS.HISTOGRAM_BUCKET, {value: bucket, histogramBucket: category, source: "chart" })
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

  let flowEfficiencyQuadrantSummaryElement = (
    <MotionEfficiencyQuadrantSummaryCard
      workItems={appliedFilters.size === 0 ? initTransformedData : latestData}
      stateTypes={stateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      className="tw-mx-auto tw-w-[98%]"
      onQuadrantClick={(quadrant) => {
        if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && chartCategory === chart_category) {
          handleQuadrantClear();
        } else {
          setAppliedFilters((prev) => {
            return new Map(
              prev.set(FILTERS.QUADRANT_PANEL, {value: [quadrant]}).set(FILTERS.PRIMARY_CATEGORY, {value: [chart_category]})
            );
          });
        }
      }}
      selectedQuadrant={selectedQuadrant}
    />
  );

  if (displayBag?.wipChartType === "motion") {
    if (currentInteraction === "histogram") {
      flowEfficiencyQuadrantSummaryElement = React.cloneElement(flowEfficiencyQuadrantSummaryElement, {
        onQuadrantClick: undefined,
      });
    }
  }

  let quadrantSummaryElement = (
    <div className={`tw-flex tw-h-[23%] tw-items-center tw-bg-chart`}>
      {displayBag?.displayType === "FlowEfficiencyCard" ? (
        flowEfficiencyQuadrantSummaryElement
      ) : (
        <QuadrantSummaryPanel
          workItems={filterByStateTypes(initTransformedData, stateTypes)}
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

    let selectedFilter = "";
    if (currentInteraction === "histogram") {
      selectedFilter = histogramBucket;
    }
    if (currentInteraction === "queuesize") {
      selectedFilter = getFilterValue(appliedFilters, FILTERS.STATE)[0].value;
    }

    const ageFilterElement = <AgeFilterWrapper selectedFilter={selectedFilter} handleClearClick={handleResetAll} />;
    const quadrantFilterElement = selectedQuadrant && chartCategory === chart_category && (
      <QuadrantFilterWrapper
        selectedQuadrant={QuadrantNames[selectedQuadrant]}
        selectedFilter={getQuadrantDescription({intl, cycleTimeTarget, latencyTarget})[selectedQuadrant]}
        handleClearClick={handleResetAll}
      />
    );
    const queueSizeFilterElement = (
      <QueueSizeFilterWrapper selectedFilter={selectedFilter} handleClearClick={handleResetAll} />
    );

    let filterElement;
    if (currentInteraction === "histogram" && chartCategory === chart_category) {
      filterElement = ageFilterElement;
    }

    if (currentInteraction === "queuesize" && chartCategory === chart_category) {
      filterElement = queueSizeFilterElement;
    }

    // wipChartType 'queue', 'age', 'motion'
    if (displayBag?.wipChartType === "queue") {
      const queueSizeElement = (
        <WipQueueSizeChart
          items={appliedFilters.size > 0 ? latestData : initTransformedData}
          stageName={stageName}
          phases={stateTypes}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            setAppliedFilters((prev) => {
              return new Map(
                prev
                  .set(FILTERS.PRIMARY_CATEGORY, {value: [chart_category]})
                  .set(FILTERS.CURRENT_INTERACTION, {value: ["queuesize"]})
                  .set(FILTERS.STATE, {value: [{value: obj.options.name, label: obj.options.name}]})
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

    // if (displayBag?.wipChartType !== "motion") {
    //   quadrantSummaryElement = null;
    // }

    if (chartCategory != null && chartCategory !== chart_category) {
      quadrantSummaryElement = null;
    }
  }

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div className={quadrantSummaryElement ? "tw-relative tw-h-[77%]" : "tw-h-full"}>{chartElement}</div>
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
