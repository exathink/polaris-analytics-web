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
  ClearFilterWrapper,
} from "./cycleTimeLatencyUtils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useGenerateTicks} from "../../../../hooks/useGenerateTicks";
import {AGE_LATENCY_ENHANCEMENTS} from "../../../../../../../config/featureFlags";
import {useWidget} from "../../../../../../framework/viz/dashboard/widgetCore";

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
  const [selectedFilter, setFilter] = React.useState([]);
  const [selectedCategory, setSelectedCategory] = React.useState();

  const blurClass = useBlurClass();
  const tick = useGenerateTicks(2, 60000);

  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
    stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
  );

  function handleClearClick() {
    setFilter([]);
    setSelectedCategory(undefined);
  }
  const seriesData = useCycleTimeLatencyHook(workItemsWithAggregateDurations);
  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);
  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div className="tw-relative tw-h-[77%]">
          {ageLatencyFeatureFlag ? (
            <>
              {selectedFilter.length > 0 && (
                <>
                <WorkItemsCycleTimeVsLatencyChart
                  view={view}
                  stageName={stageName}
                  specsOnly={specsOnly}
                  workItems={selectedFilter}
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
                <ClearFilterWrapper selectedFilter={selectedCategory} handleClearClick={handleClearClick} />
                </>
              )}

              {selectedFilter.length === 0 && (
                <WorkItemsDetailHistogramChart
                  chartConfig={{
                    title: getTitleForHistogram({workItems: workItemsWithAggregateDurations, specsOnly, stageName}),
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
              )}
            </>
          ) : (
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
          )}
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
