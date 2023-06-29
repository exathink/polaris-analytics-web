import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import styles from "./cycleTimeLatency.module.css";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {Button, Checkbox} from "antd";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {
  AgeFilterWrapper,
  COL_WIDTH_BOUNDARIES,
  FILTERS,
  filterFns,
  getFilterValue,
  getFilteredData,
  getQuadrant,
  getTooltipForAgeLatency,
  engineeringStateTypes,
  deliveryStateTypes,
} from "./cycleTimeLatencyUtils";
import {EVENT_TYPES, getUniqItems, useFeatureFlag} from "../../../../../../helpers/utility";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import classNames from "classnames";
import {FlowEfficiencyQuadrantSummaryCard} from "./flowEfficiencyQuadrantSummaryCard";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {useIntl} from "react-intl";
import {useCycleTimeLatencyHook, getSubTitleForHistogram} from "./cycleTimeLatencyUtils";
import {AGE_LATENCY_ENHANCEMENTS} from "../../../../../../../config/featureFlags";
import {useWidget} from "../../../../../../framework/viz/dashboard/widgetCore";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {WipQueueSizeChart} from "../../../../charts/workItemCharts/wipQueueSizeChart";
import {SelectDropdown, SelectDropdownMultiple, defaultOptionType} from "../../../../components/select/selectUtils";
import {workItemTypeImageMap} from "../../../../../projects/shared/helper/renderers";
import {useLocalStorage} from "../../../../../../helpers/hooksUtil";
import { DELIVERY_PHASES, ENGINEERING_PHASES } from "../../../../config";

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

  const gridRef = React.useRef(null);
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  const [placement, setPlacement] = React.useState("top");
  const [eventSource, setEventSource] = React.useState("init");

  // maintain all filters state over here
  const [appliedFilters, setAppliedFilters] = React.useState(new Map());

  // chart related state
  const [selectedQuadrant] = getFilterValue(appliedFilters, FILTERS.QUADRANT_PANEL);
  const [chartCategory] = getFilterValue(appliedFilters, FILTERS.CATEGORY);
  const [currentInteraction, secondaryData] = getFilterValue(appliedFilters, FILTERS.CURRENT_INTERACTION);

  // dropdown filters state
  const [selectedWorkStream = defaultOptionType] = getFilterValue(appliedFilters, FILTERS.WORK_STREAM);
  const [selectedTeam = defaultOptionType] = getFilterValue(appliedFilters, FILTERS.TEAM);
  const [selectedIssueType = defaultOptionType] = getFilterValue(appliedFilters, FILTERS.ISSUE_TYPE);
  const selectedStateValues = getFilterValue(appliedFilters, FILTERS.STATE);

  // other states
  const [exclude, setExclude] = React.useState(false);

  const [wip_chart_type_localstorage, setValueToLocalStorage] = useLocalStorage("wip_chart_type");
  const [wipChartType, setWipChartType] = React.useState(wip_chart_type_localstorage || "queue");

  const updateWipChartType = React.useCallback((value) => {
    setValueToLocalStorage(value);
    setWipChartType(value);
  }, [setValueToLocalStorage])

  const callBacks = React.useMemo(
    () => ({setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters, setWipChartType: updateWipChartType, setEventSource}),
    [setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters, updateWipChartType, setEventSource]
  );

  const initWorkItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  function handleSelectionChange(items, eventType) {
    if (eventType === EVENT_TYPES.POINT_CLICK) {
      setPlacement("bottom");
      setWorkItemKey(items[0].key);
      setShowPanel(true);
    }
    if (eventType === EVENT_TYPES.ZOOM_SELECTION) {
      setAppliedFilters(
        (prev) => new Map(prev.set(FILTERS.CURRENT_INTERACTION, ["zoom_selection", {selectedChartData: items}]))
      );
    }
    if (eventType === EVENT_TYPES.RESET_ZOOM_SELECTION) {
      setAppliedFilters((prev) => new Map(prev.set(FILTERS.CURRENT_INTERACTION, ["zoom_reset_selection"])));
    }
  }

  function handleResetAll() {
    setAppliedFilters(new Map());
    // resets all filters of the ag-grid table
    gridRef.current.api.setFilterModel(null);

    updateWipChartType("queue");
    // reset chart components state
    resetComponentState();
  }

  function handleQuadrantClear() {
    appliedFilters.delete(FILTERS.QUADRANT_PANEL);
    appliedFilters.delete(FILTERS.CURRENT_INTERACTION);
    appliedFilters.delete(FILTERS.CATEGORY);

    setAppliedFilters(new Map(appliedFilters));
  }

  function handleAgeClearClick() {
    appliedFilters.delete(FILTERS.CYCLETIME);
    appliedFilters.delete(FILTERS.CURRENT_INTERACTION);
    appliedFilters.delete(FILTERS.CATEGORY);

    updateWipChartType("age");

    // remove age, currentInteraction, category filter
    setAppliedFilters(new Map(appliedFilters));
  }

  // Update the state filter based on exclude flag
  filterFns.state = exclude
    ? (w, selectedStateValues) =>
        selectedStateValues.length === 0 || selectedStateValues.map((x) => x.value).includes(w.state) === false
    : (w, selectedStateValues) =>
        selectedStateValues.length === 0 || selectedStateValues.map((x) => x.value).includes(w.state);

  const initTransformedData = React.useMemo(() => getWorkItemDurations(initWorkItems).map((w) => ({
    ...w,
    quadrant: getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget),
  })), [initWorkItems, cycleTimeTarget, latencyTarget]);

      // this data is always up-to-date with all the applied filters
  const latestData = React.useMemo(() => {
    const _latestData = getFilteredData({
      initData: initTransformedData,
      appliedFilters,
      filterFns,
    });

    return _latestData;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, initTransformedData, exclude]);

 // eventSource --> init / table, 
 // whether interaction started from table or outside table
 // if it started from table, we want to use recently cached data instead of using latest data
  const latestDataForTable = React.useMemo(() => {
    return latestData;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventSource, initTransformedData, exclude]);
  


  const engineeringWorkItems = React.useMemo(() => latestData.filter((w) => engineeringStateTypes.indexOf(w.stateType) !== -1), [latestData]);
  const deliveryWorkItems = React.useMemo(() => latestData.filter((w) => deliveryStateTypes.indexOf(w.stateType) !== -1), [latestData]);
 
  const engineeringSeriesData = useCycleTimeLatencyHook(engineeringWorkItems);
  const deliverySeriesData = useCycleTimeLatencyHook(deliveryWorkItems);

  let codingHistogramElement = (
    <WorkItemsDetailHistogramChart
      chartConfig={{
        title: `Age Analysis: Coding`,
        align: {align: "left"},
        subtitle: getSubTitleForHistogram({workItems: latestData, specsOnly, intl}),
        xAxisTitle: "Age in Days",
        tooltip: getTooltipForAgeLatency,
        legendItemClick: () => {},
      }}
      selectedMetric={"age"}
      specsOnly={specsOnly}
      colWidthBoundaries={COL_WIDTH_BOUNDARIES}
      stateType={"deliver"}
      series={engineeringSeriesData}
      onPointClick={({options, category}) => {
        const bucket = options.bucket;
        setAppliedFilters((prev) => {
          return new Map(
            prev
              .set(FILTERS.CATEGORY, ["engineering"])
              .set(FILTERS.CURRENT_INTERACTION, ["histogram", {histogramBucket: category, selectedChartData: bucket}])
          );
        });
        updateWipChartType("motion");
      }}
    />
  );

  let deliveryHistogramElement = (
    <WorkItemsDetailHistogramChart
      chartConfig={{
        title: `Age Analysis: Shipping`,
        align: {align: "left"},
        subtitle: getSubTitleForHistogram({workItems: latestData, specsOnly, intl}),
        xAxisTitle: "Age in Days",
        tooltip: getTooltipForAgeLatency,
        legendItemClick: () => {},
      }}
      selectedMetric={"age"}
      specsOnly={specsOnly}
      colWidthBoundaries={COL_WIDTH_BOUNDARIES}
      stateType={"deliver"}
      series={deliverySeriesData}
      onPointClick={({options, category}) => {
        const bucket = options.bucket;
        setAppliedFilters((prev) => {
          return new Map(
            prev
              .set(FILTERS.CATEGORY, ["delivery"])
              .set(FILTERS.CURRENT_INTERACTION, ["histogram", {histogramBucket: category, selectedChartData: bucket}])
          );
        });
        updateWipChartType("motion");
      }}
    />
  );

  let codingChartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={"Coding"}
      specsOnly={specsOnly}
      workItems={chartCategory === undefined || chartCategory === "engineering" ? engineeringWorkItems : []}
      stateTypes={engineeringStateTypes}
      groupByState={groupByState}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      tooltipType={tooltipType}
      onSelectionChange={handleSelectionChange}
      selectedQuadrant={chartCategory === "engineering" ? selectedQuadrant : undefined}
    />
  );

  let deliveryChartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={"Shipping"}
      specsOnly={specsOnly}
      workItems={chartCategory === undefined || chartCategory === "delivery" ? deliveryWorkItems : []}
      stateTypes={deliveryStateTypes}
      groupByState={groupByState}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      tooltipType={tooltipType}
      onSelectionChange={handleSelectionChange}
      selectedQuadrant={chartCategory === "delivery" ? selectedQuadrant : undefined}
    />
  );

  let codingQuadrantSummaryElement = (
    <FlowEfficiencyQuadrantSummaryCard
      workItems={latestData}
      stateTypes={engineeringStateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      onQuadrantClick={(quadrant) => {
        setEventSource("init");
        if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && chartCategory === "engineering") {
          handleQuadrantClear();
        } else {
          setAppliedFilters((prev) => {
            return new Map(
              prev
                .set(FILTERS.QUADRANT_PANEL, [quadrant])
                .set(FILTERS.CATEGORY, ["engineering"])
                .set(FILTERS.CURRENT_INTERACTION, ["quadrant"])
            );
          });
        }
      }}
      selectedQuadrant={chartCategory === "engineering" ? selectedQuadrant : undefined}
    />
  );

  let deliveryQuadrantSummaryElement = (
    <FlowEfficiencyQuadrantSummaryCard
      workItems={latestData}
      stateTypes={deliveryStateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      onQuadrantClick={(quadrant) => {
        setEventSource("init");
        if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && chartCategory === "delivery") {
          handleQuadrantClear();
        } else {
          setAppliedFilters((prev) => {
            return new Map(
              prev
                .set(FILTERS.QUADRANT_PANEL, [quadrant])
                .set(FILTERS.CATEGORY, ["delivery"])
                .set(FILTERS.CURRENT_INTERACTION, ["quadrant"])
            );
          });
        }
      }}
      selectedQuadrant={chartCategory === "delivery" ? selectedQuadrant : undefined}
    />
  );

  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);
  if (ageLatencyFeatureFlag) {
    const originalCodingChartElement = codingChartElement;
    const originalDeliveryChartElement = deliveryChartElement;

    let selectedFilter = "";
    if (currentInteraction === "histogram") {
      selectedFilter = secondaryData.histogramBucket;
    }
    if (currentInteraction === "cycleTime") {
      selectedFilter = appliedFilters.get(FILTERS.CYCLETIME);
    }
    const ageFilterElement = <AgeFilterWrapper selectedFilter={selectedFilter} handleClearClick={handleAgeClearClick} />;

    let engineeringFilterElement, deliveryFilterElement;

    if (currentInteraction === "histogram") {
      if (chartCategory === "engineering") {
        engineeringFilterElement = ageFilterElement;
      }
      if (chartCategory === "delivery") {
        deliveryFilterElement = ageFilterElement;
      }
    }

    if (currentInteraction === "cycleTime") {
      engineeringFilterElement = ageFilterElement;
      deliveryFilterElement = ageFilterElement;
    }

    // wipChartType 'queue', 'age', 'motion'
    if (wipChartType === "queue") {
      // show 3 modes
      const codingQueueSizeElement = (
        <WipQueueSizeChart
          items={chartCategory === "delivery" ? [] : latestData}
          stageName={"Coding"}
          phases={ENGINEERING_PHASES}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            setAppliedFilters((prev) => {
              return new Map(
                prev
                  .set(FILTERS.CATEGORY, ["engineering"])
                  .set(FILTERS.CURRENT_INTERACTION, ["queuesize"])
                  .set(FILTERS.STATE, [{value: obj.options.name, label: obj.options.name}])
              );
            });
            updateWipChartType("age");
          }}
        />
      );
      const deliveryQueueSizeElement = (
        <WipQueueSizeChart
          items={chartCategory === "engineering" ? [] : latestData}
          stageName={"Shipping"}
          phases={DELIVERY_PHASES}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            setAppliedFilters((prev) => {
              return new Map(
                prev
                  .set(FILTERS.CATEGORY, ["delivery"])
                  .set(FILTERS.CURRENT_INTERACTION, ["queuesize"])
                  .set(FILTERS.STATE, [{value: obj.options.name, label: obj.options.name}])
              );
            });
            updateWipChartType("age");
          }}
        />
      );

      // currentInteraction === null && chartCategory == null
      codingChartElement = (
        <div className="tw-relative tw-h-full">
          {codingQueueSizeElement} {engineeringFilterElement}
        </div>
      );
      deliveryChartElement = (
        <div className="tw-relative tw-h-full">
          {deliveryQueueSizeElement} {deliveryFilterElement}
        </div>
      );
    }

    if (wipChartType === "age") {
      // show 2 modes
      // chartState.chartClicked === null && chartState.selectedCategory == null
      codingChartElement = (
        <div className="tw-relative tw-h-full">
          {codingHistogramElement} {engineeringFilterElement}
        </div>
      );
      deliveryChartElement = (
        <div className="tw-relative tw-h-full">
          {deliveryHistogramElement} {deliveryFilterElement}
        </div>
      );
    }

    if (wipChartType === "motion") {
      codingChartElement = (
        <div className="tw-relative tw-h-full">
          {originalCodingChartElement} {engineeringFilterElement}
        </div>
      );
      deliveryChartElement = (
        <div className="tw-relative tw-h-full">
          {originalDeliveryChartElement} {deliveryFilterElement}
        </div>
      );
    }
  }

  let engineeringElement = (
    <div
      className={classNames(
        "tw-grid tw-h-full tw-grid-cols-2 tw-gap-x-2",
        !ageLatencyFeatureFlag ? "tw-grid-rows-[75%,25%]" : "tw-grid-rows-[100%]"
      )}
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
    if (currentInteraction === "histogram") {
      codingQuadrantSummaryElement = React.cloneElement(codingQuadrantSummaryElement, {
        workItems: latestData,
        onQuadrantClick: undefined,
      });
      deliveryQuadrantSummaryElement = React.cloneElement(deliveryQuadrantSummaryElement, {
        workItems: latestData,
        onQuadrantClick: undefined,
      });
    }

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

  // uniqueItems for all dropdowns
  const uniqueWorkStreams = getUniqItems(initWorkItems, (x) => x.workItemsSourceName).map((x) => ({
    value: x.workItemsSourceName,
    label: x.workItemsSourceName,
  }));

  const uniqueTeams = getUniqItems(
    initWorkItems.flatMap((x) => x.teamNodeRefs),
    (x) => x.teamKey
  ).map((x) => ({value: x.teamKey, label: x.teamName}));

  const uniqueIssueTypes = [
    defaultOptionType,
    {value: "story", label: "Story", icon: workItemTypeImageMap.story},
    {value: "task", label: "Task", icon: workItemTypeImageMap.task},
    {value: "bug", label: "Bug", icon: workItemTypeImageMap.bug},
    {value: "subtask", label: "Sub Task", icon: workItemTypeImageMap.subtask},
  ];

  const states = [...new Set(initWorkItems.map((x) => x.state))].map((x) => ({value: x, label: x}));

  return (
    <div className={classNames(styles.cycleTimeLatencyDashboard, "tw-grid-rows-[9%_52%_39%]")}>
      <div className={styles.topControls}>
        <div className={classNames(styles.title, "tw-text-2xl")}>Flow Efficiency</div>
        <div className={styles.filters}>
          <SelectDropdown
            title="WorkStream"
            uniqueItems={[defaultOptionType, ...uniqueWorkStreams]}
            handleChange={(item) => {
              setEventSource("init");
              setAppliedFilters((prev) => {
                if (item.value === defaultOptionType.value) {
                  prev.delete(FILTERS.WORK_STREAM);
                  prev.delete(FILTERS.CURRENT_INTERACTION);
                  return new Map(prev);
                }
                return new Map(prev.set(FILTERS.WORK_STREAM, [item]).set(FILTERS.CURRENT_INTERACTION, ["dropdown"]));
              });
            }}
            selectedValue={selectedWorkStream}
            testId="workstream-dropdown"
            className="tw-w-28"
          />
          <SelectDropdown
            title={"Team"}
            uniqueItems={[defaultOptionType, ...uniqueTeams]}
            selectedValue={selectedTeam}
            testId="team-dropdown"
            handleChange={(item) => {
              setEventSource("init");
              setAppliedFilters((prev) => {
                if (item.value === defaultOptionType.value) {
                  prev.delete(FILTERS.TEAM);
                  prev.delete(FILTERS.CURRENT_INTERACTION);
                  return new Map(prev);
                }
                return new Map(prev.set(FILTERS.TEAM, [item]).set(FILTERS.CURRENT_INTERACTION, ["dropdown"]));
              });
            }}
            className="tw-w-28"
          />
          <SelectDropdown
            title={"Issue Type"}
            testId="issue-type-dropdown"
            uniqueItems={uniqueIssueTypes}
            selectedValue={selectedIssueType}
            handleChange={(item) => {
              setEventSource("init");
              setAppliedFilters((prev) => {
                if (item.value === defaultOptionType.value) {
                  prev.delete(FILTERS.ISSUE_TYPE);
                  prev.delete(FILTERS.CURRENT_INTERACTION);
                  return new Map(prev);
                }
                return new Map(prev.set(FILTERS.ISSUE_TYPE, [item]).set(FILTERS.CURRENT_INTERACTION, ["dropdown"]));
              });
            }}
            className="tw-w-28"
          />
          <div className="tw-h-8 tw-w-[1px] tw-self-end tw-bg-gray-200 tw-pt-2"></div>
          <div className="tw-flex tw-gap-2">
            <SelectDropdownMultiple
              title="State"
              uniqueItems={states}
              selectedValues={selectedStateValues}
              handleChange={(values) => {
                setEventSource("init");
                setAppliedFilters((prev) => {
                  if (values.length > 0) {
                    prev.delete(FILTERS.CATEGORY);
                    return new Map(prev.set(FILTERS.STATE, values).set(FILTERS.CURRENT_INTERACTION, ["dropdown"]));
                  } else {
                    prev.delete(FILTERS.STATE);
                    prev.delete(FILTERS.CATEGORY);
                    prev.delete(FILTERS.CURRENT_INTERACTION);
                    return new Map(prev);
                  }
                });
              }}
              className="tw-w-[13rem]"
            />
            <Checkbox
              onChange={(e) => {
                setEventSource("init");
                setExclude(e.target.checked);
              }}
              name="state-exclude"
              checked={exclude}
              className="!tw-mb-1 tw-self-end"
            >
              Exclude
            </Checkbox>
          </div>
        </div>
        <WorkItemScopeSelector
          workItemScope={workItemScope}
          setWorkItemScope={setWorkItemScope}
          layout="col"
          className="tw-ml-auto"
        />

        {ageLatencyFeatureFlag && (
          <div>
            <GroupingSelector
              label="Show"
              value={wipChartType}
              onGroupingChanged={updateWipChartType}
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
              layout="col"
            />
          </div>
        )}

        <div className="tw-mr-14 tw-w-8">
          <div className="tw-invisible">dummy</div>
          {appliedFilters.size > 0 && (
            <Button onClick={handleResetAll} type="secondary" size="small" className={styles.resetAll}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      <div className={styles.engineering}>{engineeringElement}</div>

      <div className={styles.cycleTimeLatencyTable} data-testid="wip-latency-table">
        <CycleTimeLatencyTable
          ref={gridRef}
          tableData={eventSource === "table" ? latestDataForTable : latestData}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          callBacks={callBacks}
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
