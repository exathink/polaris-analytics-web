import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {WorkItemStateTypes} from "../../../../config";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import styles from "./cycleTimeLatency.module.css";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {Button, Checkbox} from "antd";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {AgeFilterWrapper, COL_WIDTH_BOUNDARIES, FILTERS, getQuadrant, getTooltipForAgeLatency} from "./cycleTimeLatencyUtils";
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
import {allPairs, getHistogramCategories} from "../../../../../projects/shared/helper/utils";

const engineeringStateTypes = [WorkItemStateTypes.open, WorkItemStateTypes.make];
const deliveryStateTypes = [WorkItemStateTypes.deliver];

let filterFns = {
  [FILTERS.ISSUE_TYPE]: (w, [selectedIssueType]) =>
    selectedIssueType.value === "all" || w.workItemType === selectedIssueType.value,
  [FILTERS.WORK_STREAM]: (w, [selectedWorkStream]) =>
    selectedWorkStream.value === "all" || w.workItemsSourceName === selectedWorkStream.value,
  [FILTERS.TEAM]: (w, [selectedTeam]) => {
    const _teams = w.teamNodeRefs.map((t) => t.teamKey);
    return selectedTeam.value === "all" || _teams.includes(selectedTeam.value);
  },
  [FILTERS.QUADRANT_PANEL]: (w, [selectedQuadrant]) =>
    selectedQuadrant === undefined || selectedQuadrant === w.quadrant,
  [FILTERS.QUADRANT]: (w, filterVals) => {
    return filterVals.some((filterVal) => w.quadrant.indexOf(filterVal) === 0);
  },
  [FILTERS.CYCLETIME]: (w, filterVals) => {
    const categories = getHistogramCategories(COL_WIDTH_BOUNDARIES, "days");
    const allPairsData = allPairs(COL_WIDTH_BOUNDARIES);

    return filterVals.some((filterVal) => {
      const [part1, part2] = allPairsData[categories.indexOf(filterVal)];
      return Number(w["cycleTime"]) >= part1 && Number(w["cycleTime"]) < part2;
    });
  },
  [FILTERS.NAME]: (w, [filterVal]) => {
    const re = new RegExp(filterVal, "i");
    return w.name.match(re);
  },
  // would be replaced at runtime, based on exclude value
  [FILTERS.STATE]: (w) => {},
  [FILTERS.CATEGORY]: (w, [chartCategory]) =>
    chartCategory === undefined ||
    (chartCategory === "engineering"
      ? engineeringStateTypes.indexOf(w.stateType) !== -1
      : deliveryStateTypes.indexOf(w.stateType) !== -1),
};

/**
 *
 * @typedef {Object} Props
 * @property {any[]} initData - data from the widget
 * @property {Map} appliedFilters - all applied filters
 * @property {object} filterFns - all filter conditions callback
 */

// appliedFilters: {filterKey1: [], filterKey2: [], filterKey3: []}; => can keep them in a Map
// filterFns: {filterKey1: (item, filterVals) => boolean, filterKey2: (item, filterVals) => boolean, filterKey3: (item, filterVals) => boolean}
// initData: [{}, {}, {}...]
/**
 * @param {Props} {
 * initData,
 * appliedFilters
 * filterFns
 * }
 */
export function getFilteredData({initData, appliedFilters, filterFns}) {
  let result = [];
  const [interaction, secondaryData] = appliedFilters.get(FILTERS.CURRENT_INTERACTION) ?? [];

  if (interaction === "histogram" || interaction === "zoom_selection") {
    return secondaryData.selectedChartData;
  }
  if (interaction === "zoom_reset_selection") {
    return initData;
  }

  // remove currentInteraction
  const remainingFilters = [...appliedFilters.keys()].filter((k) => k !== FILTERS.CURRENT_INTERACTION);

  initData.forEach((item) => {
    // apply all filters
    const allFiltersPassed = remainingFilters.every((filterKey) => {
      const filterValues = appliedFilters.get(filterKey);
      return filterFns[filterKey](item, filterValues);
    });

    // add the item if all filters are passed
    if (allFiltersPassed) {
      result.push(item);
    }
  });

  return result;
}

/**
 *
 * @param {Map} appliedFilters
 * @param {string} filterKey
 * @returns any
 */
function getFilterValue(appliedFilters, filterKey) {
  const filterValues = appliedFilters.get(filterKey) ?? [];
  return filterValues;
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

  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  const [placement, setPlacement] = React.useState("top");

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
  const [wipChartType, setWipChartType] = React.useState("queue");

  const callBacks = {setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters, setWipChartType};

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
    setWipChartType("queue");
    // reset chart components state
    resetComponentState();
  }

  function handleAgeClearClick() {
    appliedFilters.delete(FILTERS.CYCLETIME);
    appliedFilters.delete(FILTERS.CURRENT_INTERACTION);
    appliedFilters.delete(FILTERS.CATEGORY);

    // remove age, currentInteraction, category filter
    setAppliedFilters(new Map(appliedFilters));
  }

  // Update the state filter based on exclude flag
  filterFns.state = exclude
    ? (w, selectedStateValues) =>
        selectedStateValues.length === 0 || selectedStateValues.map((x) => x.value).includes(w.state) === false
    : (w, selectedStateValues) =>
        selectedStateValues.length === 0 || selectedStateValues.map((x) => x.value).includes(w.state);

  const initTransformedData = getWorkItemDurations(initWorkItems).map((w) => ({
    ...w,
    quadrant: getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget),
  }));

  // this data is always up-to-date with all the applied filters
  const latestData = getFilteredData({
    initData: initTransformedData,
    appliedFilters,
    filterFns,
  });
  const engineeringWorkItems = latestData.filter((w) => engineeringStateTypes.indexOf(w.stateType) !== -1);
  const deliveryWorkItems = latestData.filter((w) => deliveryStateTypes.indexOf(w.stateType) !== -1);

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
        setWipChartType("motion");
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
        setWipChartType("motion");
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
      workItems={initTransformedData}
      stateTypes={engineeringStateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      onQuadrantClick={(quadrant) => {
        if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && chartCategory === "engineering") {
          handleResetAll();
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
      workItems={initTransformedData}
      stateTypes={deliveryStateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      onQuadrantClick={(quadrant) => {
        if (selectedQuadrant !== undefined && selectedQuadrant === quadrant && chartCategory === "delivery") {
          handleResetAll();
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

    // wipChartType 'queue', 'age', 'motion'
    if (wipChartType === "queue") {
      // show 3 modes
      const codingQueueSizeElement = (
        <WipQueueSizeChart
          items={chartCategory === "delivery" ? [] : engineeringWorkItems}
          stageName={"Coding"}
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
            setWipChartType("age");
          }}
        />
      );
      const deliveryQueueSizeElement = (
        <WipQueueSizeChart
          items={chartCategory === "engineering" ? [] : deliveryWorkItems}
          stageName={"Shipping"}
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
            setWipChartType("age");
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

    if (wipChartType !== "motion") {
      codingQuadrantSummaryElement = null;
      deliveryQuadrantSummaryElement = null;
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
    if (wipChartType === "motion") {
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
        <div className={classNames(styles.title, "tw-text-2xl")}>Queue Monitoring</div>
        <div className={styles.filters}>
          <SelectDropdown
            title="WorkStream"
            uniqueItems={[defaultOptionType, ...uniqueWorkStreams]}
            handleChange={(item) => {
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
                setAppliedFilters((prev) => {
                  if (values.length > 0) {
                    prev.delete(FILTERS.CATEGORY);
                    return new Map(prev.set("state", values).set(FILTERS.CURRENT_INTERACTION, ["dropdown"]));
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
              onChange={(e) => setExclude(e.target.checked)}
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
          tableData={latestData}
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
