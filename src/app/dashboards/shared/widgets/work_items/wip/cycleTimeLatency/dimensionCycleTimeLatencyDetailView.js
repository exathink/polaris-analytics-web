import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {isObjectEmpty} from "../../../../../projects/shared/helper/utils";
import {WorkItemStateTypeDisplayName, WorkItemStateTypes} from "../../../../config";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import styles from "./cycleTimeLatency.module.css";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {Button} from "antd";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {AgeFilterWrapper, COL_WIDTH_BOUNDARIES, getQuadrant, getTooltipForAgeLatency, QueueSizeFilterWrapper} from "./cycleTimeLatencyUtils";
import {EVENT_TYPES, getUniqItems, useFeatureFlag} from "../../../../../../helpers/utility";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {joinTeams} from "../../../../helpers/teamUtils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import classNames from "classnames";
import {
  defaultIssueType,
  SelectIssueTypeDropdown,
  uniqueIssueTypes,
} from "../../../../components/select/selectIssueTypeDropdown";
import {useSelect} from "../../../../components/select/selectDropdown";
import {defaultTeam, getAllUniqueTeams, SelectTeamDropdown} from "../../../../components/select/selectTeamDropdown";
import {FlowEfficiencyQuadrantSummaryCard} from "./flowEfficiencyQuadrantSummaryCard";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {useIntl} from "react-intl";
import {useCycleTimeLatencyHook, getSubTitleForHistogram} from "./cycleTimeLatencyUtils";
import {AGE_LATENCY_ENHANCEMENTS} from "../../../../../../../config/featureFlags";
import {useWidget} from "../../../../../../framework/viz/dashboard/widgetCore";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {WipQueueSizeChart} from "../../../../charts/workItemCharts/wipQueueSizeChart";

// list of columns having search feature
const SEARCH_COLUMNS = ["name", "displayId", "teams"];

const engineeringStateTypes = [WorkItemStateTypes.open, WorkItemStateTypes.make];
const deliveryStateTypes = [WorkItemStateTypes.deliver];

const EmptyObj = {}; // using the module level global variable to keep the identity of object same
function getSanitizedFilters(appliedFilters = {}) {
  const entries = Object.entries(appliedFilters).filter(([_, filterVals]) => filterVals != null);
  if (entries.length === 0) {
    return EmptyObj;
  }
  return appliedFilters;
}

// source of truth for table will be updated
// 1. when workItemScope changes(specs/all), this in turn changes initWorkItems
// 2. when we zoom on the chart
function useTableFilteredWorkItems(initWorkItems) {
  const [filteredWorkItems, setFilteredWorkItems] = React.useState(initWorkItems);

  React.useEffect(() => {
    setFilteredWorkItems(initWorkItems);
  }, [initWorkItems]);

  return [filteredWorkItems, setFilteredWorkItems];
}

// source of truth for chart will be updated
// 1. when workItemScope changes(specs/all), this in turn changes initWorkItems
// 2. when we filter on the table
function useChartFilteredWorkItems(initWorkItems, tableFilteredWorkItems, applyFiltersTest) {
  const [filteredWorkItems, setFilteredWorkItems] = React.useState(initWorkItems);

  React.useEffect(() => {
    setFilteredWorkItems(tableFilteredWorkItems.filter(applyFiltersTest));
    // eslint-disable-next-line
  }, [applyFiltersTest]);

  React.useEffect(() => {
    setFilteredWorkItems(initWorkItems);
  }, [initWorkItems]);

  return [filteredWorkItems, setFilteredWorkItems];
}



export const DimensionCycleTimeLatencyDetailView = ({
  dimension,
  stateTypes,
  stageName,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  workItemScope,
  setWorkItemScope,
  tooltipType,
  view,
  context,
}) => {
  const intl = useIntl();
  const {
    data,
    variables: {specsOnly},
  } = useWidget();
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  const [placement, setPlacement] = React.useState("top");
  const [appliedFilters, setAppliedFilters] = React.useState(EmptyObj);

  const [selectedQuadrant, setSelectedQuadrant] = React.useState();

  const callBacks = {setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters};

  const localAppliedFilters = getSanitizedFilters(appliedFilters);
  const applyFiltersTest = React.useCallback(
    (node) => {
      const [nodeWithAggrDurations] = getWorkItemDurations([node]);
      const calculatedColumns = {
        stateType: WorkItemStateTypeDisplayName[node.stateType],
        quadrant: getQuadrant(
          nodeWithAggrDurations.cycleTime,
          nodeWithAggrDurations.latency,
          cycleTimeTarget,
          latencyTarget
        ),
        teams: joinTeams(node),
      };
      const newNode = {...node, ...calculatedColumns};
      if (isObjectEmpty(localAppliedFilters)) {
        return true;
      } else {
        const entries = Object.entries(localAppliedFilters).filter(([_, filterVals]) => filterVals != null);
        return entries.every(([filterKey, filterVals]) =>
          filterVals.some((filterVal) => {
            if (SEARCH_COLUMNS.includes(filterKey)) {
              const re = new RegExp(filterVal, "i");
              return newNode[filterKey].match(re);
            } else {
              return newNode[filterKey].indexOf(filterVal) === 0;
            }
          })
        );
      }
    },
    [localAppliedFilters, cycleTimeTarget, latencyTarget]
  );

  const initWorkItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  // we maintain separate state for table and chart, using single source of truth (initWorkItems)
  const [tableFilteredWorkItems, setTableFilteredWorkItems] = useTableFilteredWorkItems(
    initWorkItems,
    applyFiltersTest
  );
  const [chartFilteredWorkItems] = useChartFilteredWorkItems(initWorkItems, tableFilteredWorkItems, applyFiltersTest);

  const [resetComponentStateKey, resetComponentState] = useResetComponentState();

  function handleSelectionChange(items, eventType) {
    if (eventType === EVENT_TYPES.POINT_CLICK) {
      setPlacement("bottom");
      setWorkItemKey(items[0].key);
      setShowPanel(true);
    }
    if (eventType === EVENT_TYPES.ZOOM_SELECTION) {
      setTableFilteredWorkItems(items);
    }
    if (eventType === EVENT_TYPES.RESET_ZOOM_SELECTION) {
      setTableFilteredWorkItems(chartFilteredWorkItems);
    }
  }



  const {
    selectedVal: {key: selectedIssueType},
    valueIndex: issueTypeValueIndex,
    handleChange: handleIssueTypeChange,
  } = useSelect({
    uniqueItems: uniqueIssueTypes,
    defaultVal: defaultIssueType,
  });

  const uniqueTeams = getAllUniqueTeams(
    getUniqItems(
      initWorkItems.flatMap((x) => x.teamNodeRefs),
      (x) => x.teamKey
    ).map((x) => ({key: x.teamKey, name: x.teamName}))
  );
  const {
    selectedVal: {key: selectedTeam},
    valueIndex: teamValueIndex,
    handleChange: handleTeamChange,
  } = useSelect({
    uniqueItems: uniqueTeams,
    defaultVal: defaultTeam,
  });

  const [chartState, updateChartState] = React.useReducer((data, partialData) => {
    const nextState = {
        ...data,
        ...partialData
    }

    return nextState;
  },{chartFilter: undefined, chartClicked: undefined, selectedCategory: undefined});

  const workItemsEngineering = React.useMemo(
    () =>
      getWorkItemDurations(chartFilteredWorkItems)
        .filter((workItem) => engineeringStateTypes.indexOf(workItem.stateType) !== -1)
        .filter(
          (w) =>
            chartState.chartFilter == null ||
            chartState.chartClicked !== "queuesize" ||
            (chartState.chartClicked === "queuesize" && chartState.chartFilter === w.state)
        ),
    [chartFilteredWorkItems, chartState]
  );

  const workItemsDelivery = React.useMemo(
    () =>
      getWorkItemDurations(chartFilteredWorkItems)
        .filter((workItem) => deliveryStateTypes.indexOf(workItem.stateType) !== -1)
        .filter(
          (w) =>
            chartState.chartFilter == null ||
            chartState.chartClicked !== "queuesize" ||
            (chartState.chartClicked === "queuesize" && chartState.chartFilter === w.state)
        ),
    [chartFilteredWorkItems, chartState]
  );

  const seriesDataEngineering = useCycleTimeLatencyHook(workItemsEngineering);
  const seriesDataDelivery = useCycleTimeLatencyHook(workItemsDelivery);
  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);

  const [wipChartType, setWipChartType] = React.useState("queue");

  const [histogramBucket, setHistogramBucket] = React.useState();

  function handleResetAll() {
    // reset table component state
    setTableFilteredWorkItems(initWorkItems);
    setAppliedFilters(EmptyObj);
    setSelectedQuadrant(undefined);

    updateChartState({chartFilter: undefined, selectedCategory: undefined, chartClicked: undefined})
    
    // reset chart components state
    resetComponentState();
  }

  function handleClearClick() {
    updateChartState({chartFilter: undefined, selectedCategory: undefined, chartClicked: undefined})

    setSelectedQuadrant(undefined);

    setTableFilteredWorkItems(initWorkItems)
  }

  React.useEffect(() => {
    if (chartState.chartClicked==="histogram" && chartState.chartFilter && chartState.chartFilter.length > 0) {
      setTableFilteredWorkItems(chartState.chartFilter)
    }
  }, [chartState, setTableFilteredWorkItems]);

  let codingHistogramElement = (
    <WorkItemsDetailHistogramChart
      chartConfig={{
        title: `Age Analysis: Coding`,
        align: {align: "left"},
        subtitle: getSubTitleForHistogram({workItems: workItemsEngineering, specsOnly, intl}),
        xAxisTitle: "Age in Days",
        tooltip: getTooltipForAgeLatency,
        legendItemClick: () => {},
      }}
      selectedMetric={"age"}
      specsOnly={specsOnly}
      colWidthBoundaries={COL_WIDTH_BOUNDARIES}
      stateType={"deliver"}
      series={seriesDataEngineering}
      onPointClick={({options, category}) => {
        const bucket = options.bucket;
        setHistogramBucket(category);
        updateChartState?.({chartFilter: bucket, selectedCategory: "engineering", chartClicked: "histogram"});
      }}
    />
  );

  let deliveryHistogramElement = (
    <WorkItemsDetailHistogramChart
      chartConfig={{
        title: `Age Analysis: Shipping`,
        align: {align: "left"},
        subtitle: getSubTitleForHistogram({workItems: workItemsDelivery, specsOnly, intl}),
        xAxisTitle: "Age in Days",
        tooltip: getTooltipForAgeLatency,
        legendItemClick: () => {},
      }}
      selectedMetric={"age"}
      specsOnly={specsOnly}
      colWidthBoundaries={COL_WIDTH_BOUNDARIES}
      stateType={"deliver"}
      series={seriesDataDelivery}
      onPointClick={({options, category}) => {
        const bucket = options.bucket;
        setHistogramBucket(category);
        updateChartState?.({chartFilter: bucket, selectedCategory: "delivery", chartClicked: "histogram"});
      }}
    />
  );

  let codingChartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={"Coding"}
      specsOnly={specsOnly}
      workItems={
        chartState.selectedCategory === undefined || chartState.selectedCategory === "engineering"
          ? chartFilteredWorkItems
          : []
      }
      stateTypes={engineeringStateTypes}
      groupByState={groupByState}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      tooltipType={tooltipType}
      onSelectionChange={handleSelectionChange}
      selectedQuadrant={chartState.selectedCategory === "engineering" ? selectedQuadrant : undefined}
    />
  );

  let deliveryChartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={"Shipping"}
      specsOnly={specsOnly}
      workItems={
        chartState.selectedCategory === undefined || chartState.selectedCategory === "delivery"
          ? chartFilteredWorkItems
          : []
      }
      stateTypes={deliveryStateTypes}
      groupByState={groupByState}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      tooltipType={tooltipType}
      onSelectionChange={handleSelectionChange}
      selectedQuadrant={chartState.selectedCategory === "delivery" ? selectedQuadrant : undefined}
    />
  );

  let codingQuadrantSummaryElement = (
    <FlowEfficiencyQuadrantSummaryCard
      workItems={chartFilteredWorkItems}
      stateTypes={engineeringStateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      onQuadrantClick={(quadrant) => {
        if (
          selectedQuadrant !== undefined &&
          selectedQuadrant === quadrant &&
          chartState.selectedCategory === "engineering"
        ) {
          handleResetAll();
        } else {
          const items = workItemsEngineering.filter(
            (x) =>
              quadrant === undefined || quadrant === getQuadrant(x.cycleTime, x.latency, cycleTimeTarget, latencyTarget)
          );
          updateChartState?.({chartFilter: items, selectedCategory: "engineering", chartClicked: "quadrant"});
          setSelectedQuadrant(quadrant);
        }
      }}
      selectedQuadrant={chartState.selectedCategory === "engineering" ? selectedQuadrant : undefined}
    />
  );

  let deliveryQuadrantSummaryElement = (
    <FlowEfficiencyQuadrantSummaryCard
      workItems={chartFilteredWorkItems}
      stateTypes={deliveryStateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      onQuadrantClick={(quadrant) => {
        if (
          selectedQuadrant !== undefined &&
          selectedQuadrant === quadrant &&
          chartState.selectedCategory === "delivery"
        ) {
          handleResetAll();
        } else {
          const items = workItemsDelivery.filter(
            (x) =>
              quadrant === undefined || quadrant === getQuadrant(x.cycleTime, x.latency, cycleTimeTarget, latencyTarget)
          );
          updateChartState?.({chartFilter: items, selectedCategory: "delivery", chartClicked: "quadrant"});

          setSelectedQuadrant(quadrant);
        }
      }}
      selectedQuadrant={chartState.selectedCategory === "delivery" ? selectedQuadrant : undefined}
    />
  );

  if(ageLatencyFeatureFlag) {
    const originalCodingChartElement = codingChartElement;
    const originalDeliveryChartElement = deliveryChartElement;
    let latencyCodingChartElement = React.cloneElement(codingChartElement, {workItems: chartState.chartFilter});
    let latencyDeliveryChartElement = React.cloneElement(deliveryChartElement, {workItems: chartState.chartFilter});

    const ageFilterElement = (
        <AgeFilterWrapper selectedFilter={histogramBucket} handleClearClick={handleClearClick} />
      );

    // wipChartType 'queue', 'age', 'motion'
    if (wipChartType === "queue") {
      // show 3 modes
      const codingQueueSizeElement = (
        <WipQueueSizeChart
          items={workItemsEngineering}
          stageName={"Coding"}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            updateChartState({
              chartFilter: obj.options.name,
              selectedCategory: "engineering",
              chartClicked: "queuesize",
            });
          }}
        />
      );
      const deliveryQueueSizeElement = (
        <WipQueueSizeChart
          items={workItemsDelivery}
          stageName={"Shipping"}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            updateChartState({chartFilter: obj.options.name, selectedCategory: "delivery", chartClicked: "queuesize"});
          }}
        />
      );
      const queueSizeFilterElement = (
        <QueueSizeFilterWrapper selectedFilter={chartState.chartFilter} handleClearClick={handleClearClick} />
      );

      // chartState.chartClicked === null && chartState.selectedCategory == null
      codingChartElement = <div className="tw-relative tw-h-full">{codingQueueSizeElement}</div>;
      deliveryChartElement = <div className="tw-relative tw-h-full">{deliveryQueueSizeElement}</div>;

      // if queuesize chart is clicked, then selectedCategory must be present
      if (chartState.chartClicked === "queuesize") {
        if (chartState.selectedCategory === "engineering") {
          codingChartElement = <div className="tw-relative tw-h-full">{codingHistogramElement} {queueSizeFilterElement}</div>;
        }
        if (chartState.selectedCategory === "delivery") {
          deliveryChartElement = <div className="tw-relative tw-h-full">{deliveryHistogramElement} {queueSizeFilterElement}</div>;
        }
      }
      // if histogram is clicked, then selectedCategory must be present
      if (chartState.chartClicked === "histogram") {
        if (chartState.selectedCategory === "engineering") {
          codingChartElement = <div className="tw-relative tw-h-full">{latencyCodingChartElement} {ageFilterElement}</div>;
        }
        if (chartState.selectedCategory === "delivery") {
          deliveryChartElement = <div className="tw-relative tw-h-full">{latencyDeliveryChartElement} {ageFilterElement}</div>;
        }
      }
    }

    if (wipChartType === "age") {
      // show 2 modes
      // chartState.chartClicked === null && chartState.selectedCategory == null
      codingChartElement = <div className="tw-relative tw-h-full">{codingHistogramElement}</div>;
      deliveryChartElement = <div className="tw-relative tw-h-full">{deliveryHistogramElement}</div>;

      // show 2 modes
      // if histogram chart is clicked, then selectedCategory must be present
      if (chartState.chartClicked === "histogram") {
        if (chartState.selectedCategory === "engineering") {
          codingChartElement = (
            <div className="tw-relative tw-h-full">
              {latencyCodingChartElement} {ageFilterElement}
            </div>
          );
        }
        if (chartState.selectedCategory === "delivery") {
          deliveryChartElement = (
            <div className="tw-relative tw-h-full">
              {latencyDeliveryChartElement} {ageFilterElement}
            </div>
          );
        }
      }
    }

    if (wipChartType === "motion") {
      codingChartElement = originalCodingChartElement;
      deliveryChartElement = originalDeliveryChartElement;
    }

    if (wipChartType !== "motion") {
      codingQuadrantSummaryElement = null;
      deliveryQuadrantSummaryElement = null;
    }

  }

  let engineeringElement = (
    <div
      className={classNames("tw-grid tw-h-full tw-grid-cols-2 tw-gap-x-2", !ageLatencyFeatureFlag ? "tw-grid-rows-[75%,25%]": "tw-grid-rows-[100%]")}
      key={resetComponentStateKey}
      data-testid="wip-latency-chart-panels"
    >
      {codingChartElement}
      {deliveryChartElement}
      <div className="tw-bg-chart">{codingQuadrantSummaryElement}</div>
      <div className="tw-bg-chart">{deliveryQuadrantSummaryElement}</div>
    </div>
  );
  if (ageLatencyFeatureFlag) {
    if (wipChartType === "motion") {
      engineeringElement = (
        <div
          className="tw-grid tw-h-full tw-grid-cols-2 tw-grid-rows-[34%_66%] tw-gap-x-2"
          key={resetComponentStateKey}
          data-testid="wip-latency-chart-panels"
        >
          <div className="tw-bg-chart">{codingQuadrantSummaryElement}</div>
          <div className="tw-bg-chart">{deliveryQuadrantSummaryElement}</div>
          {codingChartElement}
          {deliveryChartElement}
        </div>
      );
    }
  }

  return (
<div className={classNames(styles.cycleTimeLatencyDashboard, !ageLatencyFeatureFlag ? "tw-grid-rows-[4%_55%_90px_calc(42%-90px)]" : "tw-grid-rows-[4%_55%_65px_calc(42%-65px)]")}>
      <div className={classNames(styles.title, "tw-text-2xl")}>Wip Monitoring</div>

      <div className={styles.rightControls}>
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
        
        {ageLatencyFeatureFlag && <div className="">
          <GroupingSelector
            label="Show"
            value={wipChartType}
            onGroupingChanged={setWipChartType}
            groupings={[
              {
                key: "queue",
                display: "Queue Size",
              },
              {
                key: "age",
                display: "Age",
              },
              {
                key: "motion",
                display: "Motion",
              },
            ]}
          />
        </div>}
        
        <div className="tw-w-20">
        {(tableFilteredWorkItems.length < initWorkItems.length ||
          chartFilteredWorkItems.length < initWorkItems.length ||
          selectedQuadrant !== undefined) && (
          <Button onClick={handleResetAll} type="secondary" size="small" className={styles.resetAll}>
            Clear Filters
          </Button>
        )}
      </div>
      </div>

      <div className={styles.engineering}>
        {engineeringElement}
      </div>
      <div className={styles.issueTypeDropdown}>
        <SelectTeamDropdown
          uniqueTeams={uniqueTeams}
          valueIndex={teamValueIndex}
          handleTeamChange={handleTeamChange}
          className="tw-w-36"
        />
        <SelectIssueTypeDropdown
          valueIndex={issueTypeValueIndex}
          handleIssueTypeChange={handleIssueTypeChange}
          wrapperClassName="tw-ml-2"
          className="tw-w-36"
        />
      </div>
      <div className={styles.cycleTimeLatencyTable} data-testid="wip-latency-table">
        <CycleTimeLatencyTable
          tableData={getWorkItemDurations(tableFilteredWorkItems)
            .filter(
              (workItem) =>
                chartState.selectedCategory === undefined ||
                (chartState.selectedCategory === "engineering"
                  ? engineeringStateTypes.indexOf(workItem.stateType) !== -1
                  : deliveryStateTypes.indexOf(workItem.stateType) !== -1)
            )
            .filter(
              (x) =>
                selectedQuadrant === undefined ||
                selectedQuadrant === getQuadrant(x.cycleTime, x.latency, cycleTimeTarget, latencyTarget)
            )
            .filter((w) => {
              if (selectedIssueType === "all") {
                return true;
              } else {
                return w.workItemType === selectedIssueType;
              }
            })
            .filter((w) => {
              if (selectedTeam === "all") {
                return true;
              } else {
                const _teams = w.teamNodeRefs.map((t) => t.teamKey);
                return _teams.includes(selectedTeam);
              }
            })
            .filter(w => {
              return (
                chartState.chartFilter == null ||
                chartState.chartClicked !== "queuesize" ||
                (chartState.chartClicked === "queuesize" && chartState.chartFilter === w.state)
              );
            })}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          callBacks={callBacks}
          appliedFilters={appliedFilters}
          specsOnly={specsOnly}
        />
      </div>
      <div className={styles.cardInspectorPanel}>
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          context={context}
          drawerOptions={{placement: placement}}
        />
      </div>
    </div>
  );
};
