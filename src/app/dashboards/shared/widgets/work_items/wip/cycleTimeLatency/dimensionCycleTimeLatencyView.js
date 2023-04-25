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
  QueueSizeFilterWrapper,
} from "./cycleTimeLatencyUtils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useGenerateTicks} from "../../../../hooks/useGenerateTicks";
import {AGE_LATENCY_ENHANCEMENTS} from "../../../../../../../config/featureFlags";
import {useWidget} from "../../../../../../framework/viz/dashboard/widgetCore";
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

  const blurClass = useBlurClass();
  const tick = useGenerateTicks(2, 60000);

  const initWorkItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const [selectedQuadrant, setSelectedQuadrant] = React.useState();
  const [quadrantStateType, setQuadrantStateType] = React.useState();
  const [histogramBucket, setHistogramBucket] = React.useState();

  const [chartState, updateChartState] = React.useReducer(
    (data, partialData) => {
      const nextState = {
        ...data,
        ...partialData,
      };

      return nextState;
    },
    {chartFilter: undefined, chartClicked: undefined}
  );

  let filterFns = {
    quadrant: (w) =>
      selectedQuadrant === undefined ||
      selectedQuadrant === getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget),
    queuesize: (w) => {
      return (
        chartState.chartFilter == null || chartState.chartClicked !== "queuesize" || chartState.chartFilter === w.state
      );
    }
  };

  const workItemsWithAggregateDurations = getWorkItemDurations(initWorkItems)
    .filter((workItem) => stateTypes == null || stateTypes.indexOf(workItem.stateType) !== -1)
    .filter(filterFns.quadrant)
    .filter(filterFns.queuesize);

  function handleResetAll() {
    setSelectedQuadrant(undefined);
    setQuadrantStateType(undefined);

    updateChartState({chartFilter: undefined, chartClicked: undefined});
  }

  function handleClearClick() {
    updateChartState({chartFilter: undefined, chartClicked: undefined});
  }

  const seriesData = useCycleTimeLatencyHook(workItemsWithAggregateDurations);
  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);

  let histogramElement = (
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
        setHistogramBucket(category);
        updateChartState?.({chartFilter: bucket, chartClicked: "histogram"});
      }}
    />
  );
  
  let chartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={stageName}
      specsOnly={specsOnly}
      workItems={workItemsWithAggregateDurations}
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

  const flowEfficiencyQuadrantSummaryElement = <FlowEfficiencyQuadrantSummaryCard
  workItems={initWorkItems}
  stateTypes={stateTypes}
  specsOnly={specsOnly}
  cycleTimeTarget={cycleTimeTarget}
  latencyTarget={latencyTarget}
  className="tw-mx-auto tw-w-[98%]"
  onQuadrantClick={(quadrant) => {
    if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && quadrantStateType === stageName) {
      handleResetAll();
    } else {
      const workItemsWithAggregateDurations = getWorkItemDurations(initWorkItems)
        .filter((workItem) => (stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true))
        .filter(
          (x) =>
            quadrant === undefined ||
            quadrant === getQuadrant(x.cycleTime, x.latency, cycleTimeTarget, latencyTarget)
        );

      setSelectedQuadrant(quadrant);
      setQuadrantStateType(stageName);
      updateChartState?.({chartFilter: workItemsWithAggregateDurations, chartClicked: "quadrant"});
    }
  }}
  selectedQuadrant={selectedQuadrant}
/>;

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
    let latencyChartElement = React.cloneElement(chartElement, {workItems: chartState.chartFilter});
    const flowEfficiencyElement = React.cloneElement(flowEfficiencyQuadrantSummaryElement, {
      workItems: chartState.chartFilter,
      onQuadrantClick: undefined,
    });

    const ageFilterElement = <AgeFilterWrapper selectedFilter={histogramBucket} handleClearClick={handleClearClick} />;
    const quadrantFilterElement = selectedQuadrant && (
      <QuadrantFilterWrapper
        selectedQuadrant={QuadrantNames[selectedQuadrant]}
        selectedFilter={getQuadrantDescription({intl, cycleTimeTarget, latencyTarget})[selectedQuadrant]}
        handleClearClick={handleResetAll}
      />
    );

    // wipChartType 'queue', 'age', 'motion'
    if (displayBag?.wipChartType === "queue") {
      const queueSizeElement = (
        <WipQueueSizeChart
          items={workItemsWithAggregateDurations}
          stageName={stageName}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            updateChartState({
              chartFilter: obj.options.name,
              chartClicked: "queuesize",
            });
          }}
        />
      );
      const queueSizeFilterElement = (
        <QueueSizeFilterWrapper selectedFilter={chartState.chartFilter} handleClearClick={handleClearClick} />
      );

      // chartState.chartClicked === null && chartState.selectedCategory == null
      chartElement = <div className="tw-relative tw-h-full">{queueSizeElement}</div>;

      // if queuesize chart is clicked
      if (chartState.chartClicked === "queuesize") {
        chartElement = (
          <div className="tw-relative tw-h-full">
            {histogramElement} {queueSizeFilterElement}
          </div>
        );
      }
      // if histogram is clicked
      if (chartState.chartClicked === "histogram") {
        chartElement = (
          <div className="tw-relative tw-h-full">
            {latencyChartElement} {flowEfficiencyElement} {ageFilterElement}
          </div>
        );
      }
    }

    if (displayBag?.wipChartType === "age") {
      // show 2 modes
      // chartState.chartClicked === null
      chartElement = <div className="tw-relative tw-h-full">{histogramElement}</div>;

      // show 2 modes
      // if histogram chart is clicked
      if (chartState.chartClicked === "histogram") {
        chartElement = (
          <div className="tw-relative tw-h-full">
            {latencyChartElement} {flowEfficiencyElement} {ageFilterElement}
          </div>
        );
      }
    }

    if (displayBag?.wipChartType === "motion") {
      chartElement = (
        <div className="tw-relative tw-h-full">
          {originalChartElement}
          {quadrantFilterElement}
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
            displayBag?.wipChartType === "motion" || !ageLatencyFeatureFlag || chartState.chartClicked === "histogram"
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
