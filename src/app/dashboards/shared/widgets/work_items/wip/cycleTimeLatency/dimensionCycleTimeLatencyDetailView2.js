import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import styles from "./cycleTimeLatency.module.css";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {Checkbox} from "antd";
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
import {EVENT_TYPES, getUniqItems, useBlurClass, useFeatureFlag} from "../../../../../../helpers/utility";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import classNames from "classnames";
import {MotionEfficiencyQuadrantSummaryCard} from "./motionEfficiencyQuadrantSummaryCard";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {useIntl} from "react-intl";
import {useCycleTimeLatencyHook, getSubTitleForHistogram} from "./cycleTimeLatencyUtils";
import {AGE_LATENCY_ENHANCEMENTS} from "../../../../../../../config/featureFlags";
import {useWidget} from "../../../../../../framework/viz/dashboard/widgetCore";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {WipQueueSizeChart} from "../../../../charts/workItemCharts/wipQueueSizeChart";
import {SelectDropdown, SelectDropdownMultiple, defaultOptionType} from "../../../../components/select/selectUtils";
import {workItemTypeImageMap} from "../../../../../projects/shared/helper/renderers";
import {useLocalStorage, useWipData} from "../../../../../../helpers/hooksUtil";
import {DELIVERY_PHASES, ENGINEERING_PHASES, WorkItemStateTypeDisplayName} from "../../../../config";
import {WIP_CHART_TYPE} from "../../../../../../helpers/localStorageUtils";
import {ResetAllFilterIcon} from "../../../../../../components/misc/customIcons";

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
  specsOnly,
  displayBag
}) => {
  const intl = useIntl();
  const {
    data: wipDataAll,
  } = useWidget();

  const blurClass = useBlurClass();

  const {customPhaseMapping = WorkItemStateTypeDisplayName} = displayBag;

  const gridRef = React.useRef(null);
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  const [placement, setPlacement] = React.useState("top");
  const [eventSource, setEventSource] = React.useState("init");

  // maintain all filters state over here
  const [appliedFilters, setAppliedFilters] = React.useState(new Map([[FILTERS.EXCLUDE_ABANDONED, {value: [true]}]]));

  // chart related state
  const [selectedQuadrant] = getFilterValue(appliedFilters, FILTERS.QUADRANT_PANEL);
  const [chartCategory] = getFilterValue(appliedFilters, FILTERS.CATEGORY);

  // dropdown filters state
  const [selectedWorkStream = defaultOptionType] = getFilterValue(appliedFilters, FILTERS.WORK_STREAM);
  const [selectedTeam = defaultOptionType] = getFilterValue(appliedFilters, FILTERS.TEAM);
  const [selectedIssueType = defaultOptionType] = getFilterValue(appliedFilters, FILTERS.ISSUE_TYPE);
  const selectedStateValues = getFilterValue(appliedFilters, FILTERS.STATE);
  const [excludeMotionless] = getFilterValue(appliedFilters, FILTERS.EXCLUDE_ABANDONED);

  // other states
  const [exclude, setExclude] = React.useState(false);

  const [wip_chart_type_localstorage, setValueToLocalStorage] = useLocalStorage(WIP_CHART_TYPE);
  const [wipChartType, setWipChartType] = React.useState(wip_chart_type_localstorage || "queue");

  const updateWipChartType = (value) => {
    setValueToLocalStorage(value);
    setWipChartType(value);
  };

  const callBacks = {setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters, setWipChartType: updateWipChartType, setEventSource};

  const {wipWorkItems: initWorkItems} = useWipData({wipDataAll, specsOnly, dimension});

  function handleSelectionChange(items, eventType) {
    if (eventType === EVENT_TYPES.POINT_CLICK) {
      setPlacement("bottom");
      setWorkItemKey(items[0].key);
      setShowPanel(true);
    }
    if (eventType === EVENT_TYPES.ZOOM_SELECTION) {
      setAppliedFilters(
        (prev) => new Map(prev.set(FILTERS.CURRENT_INTERACTION, {value: ["zoom_selection", {selectedChartData: items}]}))
      );
    }
    if (eventType === EVENT_TYPES.RESET_ZOOM_SELECTION) {
      setAppliedFilters((prev) => new Map(prev.set(FILTERS.CURRENT_INTERACTION, {value: ["zoom_reset_selection"]})));
    }
  }

  function handleResetAll() {
    setAppliedFilters(new Map());
    // resets all filters of the ag-grid table
    gridRef.current.api.setFilterModel(null);

    updateWipChartType("queue");
    setEventSource("init");
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
    appliedFilters.delete(FILTERS.HISTOGRAM_BUCKET);
    appliedFilters.delete(FILTERS.CATEGORY);

    // resets all filters of the ag-grid table
    gridRef.current.api.setFilterModel({cycleTime: {filterType: "multi-checkbox", values: []}});

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
        title: `Age Analysis: ${customPhaseMapping.wip}`,
        align: {align: "left"},
        subtitle: getSubTitleForHistogram({workItems: engineeringWorkItems, specsOnly, intl}),
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
        setEventSource("init");
        const bucket = options.bucket;
        setAppliedFilters((prev) => {
          return new Map(
            prev
              .set(FILTERS.CATEGORY, {value: ["engineering"]})
              .set(FILTERS.HISTOGRAM_BUCKET, {value: bucket, histogramBucket: category, source: "chart" })
          );
        });
        updateWipChartType("motion");
      }}
    />
  );

  let deliveryHistogramElement = (
    <WorkItemsDetailHistogramChart
      chartConfig={{
        title: `Age Analysis: ${customPhaseMapping.complete}`,
        align: {align: "left"},
        subtitle: getSubTitleForHistogram({workItems: deliveryWorkItems, specsOnly, intl}),
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
        setEventSource("init");
        const bucket = options.bucket;
        setAppliedFilters((prev) => {
          return new Map(
            prev
              .set(FILTERS.CATEGORY, {value: ["delivery"]})
              .set(FILTERS.HISTOGRAM_BUCKET, {value: bucket, histogramBucket: category, source: "chart" })
          );
        });
        updateWipChartType("motion");
      }}
    />
  );

  let codingChartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={customPhaseMapping.wip}
      specsOnly={specsOnly}
      workItems={chartCategory === undefined || chartCategory === "engineering" ? engineeringWorkItems : []}
      stateTypes={engineeringStateTypes}
      groupByState={groupByState}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      tooltipType={tooltipType}
      onSelectionChange={handleSelectionChange}
      selectedQuadrant={chartCategory === "engineering" ? selectedQuadrant : undefined}
      excludeMotionless={Boolean(excludeMotionless)}
      blurClass={blurClass}
    />
  );

  let deliveryChartElement = (
    <WorkItemsCycleTimeVsLatencyChart
      view={view}
      stageName={customPhaseMapping.complete}
      specsOnly={specsOnly}
      workItems={chartCategory === undefined || chartCategory === "delivery" ? deliveryWorkItems : []}
      stateTypes={deliveryStateTypes}
      groupByState={groupByState}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      tooltipType={tooltipType}
      onSelectionChange={handleSelectionChange}
      selectedQuadrant={chartCategory === "delivery" ? selectedQuadrant : undefined}
      excludeMotionless={Boolean(excludeMotionless)}
      blurClass={blurClass}
    />
  );

  let codingQuadrantSummaryElement = (
    <MotionEfficiencyQuadrantSummaryCard
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
                .set(FILTERS.QUADRANT_PANEL, {value: [quadrant]})
                .set(FILTERS.CATEGORY, {value: ["engineering"]})
                .set(FILTERS.CURRENT_INTERACTION, {value: ["quadrant"]})
            );
          });
        }
      }}
      selectedQuadrant={chartCategory === "engineering" ? selectedQuadrant : undefined}
      displayBag={{className: "tw-mx-auto tw-w-[98%]", valueFontClass: "tw-text-3xl", size: "small"}}
    />
  );

  let deliveryQuadrantSummaryElement = (
    <MotionEfficiencyQuadrantSummaryCard
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
                .set(FILTERS.QUADRANT_PANEL, {value: [quadrant]})
                .set(FILTERS.CATEGORY, {value: ["delivery"]})
                .set(FILTERS.CURRENT_INTERACTION, {value: ["quadrant"]})
            );
          });
        }
      }}
      selectedQuadrant={chartCategory === "delivery" ? selectedQuadrant : undefined}
      displayBag={{className: "tw-mx-auto tw-w-[98%]", valueFontClass: "tw-text-3xl", size: "small"}}
    />
  );

  const ageLatencyFeatureFlag = useFeatureFlag(AGE_LATENCY_ENHANCEMENTS, true);
  if (ageLatencyFeatureFlag) {
    const originalCodingChartElement = codingChartElement;
    const originalDeliveryChartElement = deliveryChartElement;

    let selectedFilter = "";
    if (appliedFilters.get(FILTERS.HISTOGRAM_BUCKET)?.histogramBucket) {
      selectedFilter = appliedFilters.get(FILTERS.HISTOGRAM_BUCKET)?.histogramBucket
    }
    if (appliedFilters.get(FILTERS.CYCLETIME)?.source === "table") {
      selectedFilter = appliedFilters.get(FILTERS.CYCLETIME)?.value;
    }
    const ageFilterElement = <AgeFilterWrapper selectedFilter={selectedFilter} handleClearClick={handleAgeClearClick} />;

    let engineeringFilterElement, deliveryFilterElement;

    if (appliedFilters.get(FILTERS.HISTOGRAM_BUCKET)?.histogramBucket) {
      if (chartCategory === "engineering") {
        engineeringFilterElement = ageFilterElement;
      }
      if (chartCategory === "delivery") {
        deliveryFilterElement = ageFilterElement;
      }
    }

    if (appliedFilters.get(FILTERS.CYCLETIME)?.source === "table") {
      engineeringFilterElement = ageFilterElement;
      deliveryFilterElement = ageFilterElement;
    }

    // wipChartType 'queue', 'age', 'motion'
    if (wipChartType === "queue") {
      // show 3 modes
      const codingQueueSizeElement = (
        <WipQueueSizeChart
          items={chartCategory === "delivery" ? [] : latestData}
          stageName={customPhaseMapping.wip}
          phases={ENGINEERING_PHASES}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            setEventSource("init");
            setAppliedFilters((prev) => {
              return new Map(
                prev
                  .set(FILTERS.CATEGORY, {value: ["engineering"]})
                  .set(FILTERS.CURRENT_INTERACTION, {value: ["queuesize"]})
                  .set(FILTERS.STATE, {value: [{value: obj.options.name, label: obj.options.name}]})
              );
            });
            updateWipChartType("age");
          }}
        />
      );
      const deliveryQueueSizeElement = (
        <WipQueueSizeChart
          items={chartCategory === "engineering" ? [] : latestData}
          stageName={customPhaseMapping.complete}
          phases={DELIVERY_PHASES}
          specsOnly={specsOnly}
          onPointClick={(obj) => {
            setEventSource("init");
            setAppliedFilters((prev) => {
              return new Map(
                prev
                  .set(FILTERS.CATEGORY, {value: ["delivery"]})
                  .set(FILTERS.CURRENT_INTERACTION, {value: ["queuesize"]})
                  .set(FILTERS.STATE, {value: [{value: obj.options.name, label: obj.options.name}]})
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
    if (appliedFilters.get(FILTERS.HISTOGRAM_BUCKET)?.histogramBucket) {
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
        <div className={classNames(styles.title, "tw-text-2xl")}>Work In Process</div>
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
                return new Map(prev.set(FILTERS.WORK_STREAM, {value: [item], source: "dropdown"}));
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
                return new Map(prev.set(FILTERS.TEAM, {value: [item], source: "dropdown"}));
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
                return new Map(prev.set(FILTERS.ISSUE_TYPE, {value: [item], source: "dropdown"}));
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
                    return new Map(prev.set(FILTERS.STATE, {value: values, source: "dropdown"}));
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

        <div id="rightControls" className="tw-ml-auto tw-flex tw-gap-2">
          <div className="tw-self-center tw-text-gray-300">
            <Checkbox
              onChange={(e) => {
                setEventSource("init");
                if (e.target.checked) {
                  setAppliedFilters(
                    (prev) => new Map(prev.set(FILTERS.EXCLUDE_ABANDONED, {value: [e.target.checked]}))
                  );
                } else {
                  setAppliedFilters((prev) => {
                    prev.delete(FILTERS.EXCLUDE_ABANDONED);
                    return new Map(prev);
                  });
                }
              }}
              name="state-exclude"
              checked={excludeMotionless}
              style={{alignItems: "center"}}
            >
              <div className="tw-flex tw-flex-col tw-justify-center tw-leading-4 tw-mt-2">
                <div>Exclude</div>
                <div>Motionless</div>
              </div>
            </Checkbox>
          </div>

          <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} layout="col" />

          {ageLatencyFeatureFlag && (
            <div>
              <GroupingSelector
                label="Show"
                value={wipChartType}
                onGroupingChanged={updateWipChartType}
                groupings={[
                  {
                    key: "queue",
                    display: "Where",
                  },
                  {
                    key: "age",
                    display: "How long",
                  },
                  {
                    key: "motion",
                    display: "Last Moved",
                  },
                ]}
                layout="col"
              />
            </div>
          )}

          <div className="tw-mr-8 tw-w-8">
            <div className="tw-invisible">dummy</div>
            {appliedFilters.size > 0 && (
              <ResetAllFilterIcon onClick={handleResetAll} style={{color: "grey"}} title="Clear Filters" />
            )}
          </div>
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
