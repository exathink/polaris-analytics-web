import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {WorkItemStateTypes} from "../../../../config";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import styles from "./cycleTimeLatency.module.css";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {Button, Checkbox} from "antd";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {AgeFilterWrapper, COL_WIDTH_BOUNDARIES, getQuadrant, getTooltipForAgeLatency} from "./cycleTimeLatencyUtils";
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

const EmptyObj = {}; // using the module level global variable to keep the identity of object same

let filterFns = {
  issuetype: (w, [selectedIssueType]) =>
    selectedIssueType.value === "all" || w.workItemType === selectedIssueType.value,
  workstream: (w, [selectedWorkStream]) =>
    selectedWorkStream.value === "all" || w.workItemsSourceName === selectedWorkStream.value,
  team: (w, [selectedTeam]) => {
    const _teams = w.teamNodeRefs.map((t) => t.teamKey);
    return selectedTeam.value === "all" || _teams.includes(selectedTeam.value);
  },
  quadrantpanel: (w, [selectedQuadrant]) => selectedQuadrant === undefined || selectedQuadrant === w.quadrant,
  quadrant: (w, filterVals) => {
    return filterVals.some((filterVal) => w.quadrant.indexOf(filterVal) === 0);
  },
  cycleTime: (w, filterVals) => {
    const categories = getHistogramCategories(COL_WIDTH_BOUNDARIES, "days");
    const allPairsData = allPairs(COL_WIDTH_BOUNDARIES);

    return filterVals.some((filterVal) => {
      const [part1, part2] = allPairsData[categories.indexOf(filterVal)];
      return Number(w["cycleTime"]) >= part1 && Number(w["cycleTime"]) < part2;
    });
  },
  name: (w, [filterVal]) => {
    const re = new RegExp(filterVal, "i");
    return w.name.match(re);
  },
  // would be replaced at runtime, based on exclude value
  state: (w) => {},
  category: (w, [chartCategory]) =>
    chartCategory === undefined ||
    (chartCategory === "engineering"
      ? engineeringStateTypes.indexOf(w.stateType) !== -1
      : deliveryStateTypes.indexOf(w.stateType) !== -1),
};

/**
 *
 * @typedef {Object} Props
 * @property {any[]} initData - data from the widget
 * @property {object} appliedFilters - all applied filters
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
  const {currentInteraction: [interaction, secondaryData] = [], ...remainingFilters} = appliedFilters;

  if (interaction === "histogram" || interaction === "zoom_selection") {
    return secondaryData.selectedChartData;
  }
  if (interaction === "zoom_reset_selection") {
    return initData;
  }

  initData.forEach((item) => {
    // apply all filters
    const allFiltersPassed = Object.keys(remainingFilters).every((filterKey) => {
      const filterValues = remainingFilters[filterKey];
      return filterFns[filterKey](item, filterValues);
    });

    // add the item if all filters are passed
    if (allFiltersPassed) {
      result.push(item);
    }
  });

  return result;
}

function getFilterValue(appliedFilters, filterKey) {
  const filterValues = appliedFilters[filterKey] ?? [];
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
  const [appliedFilters, setAppliedFilters] = React.useState(EmptyObj);

  // chart related state
  const [selectedQuadrant] = getFilterValue(appliedFilters, "quadrantpanel");
  const [chartCategory] = getFilterValue(appliedFilters, "category");
  const [currentInteraction, secondaryData] = getFilterValue(appliedFilters, "currentInteraction");
  const [selectedQueueName] = getFilterValue(appliedFilters, "queuesize");

  // dropdown filters state
  const [selectedWorkStream = defaultOptionType] = getFilterValue(appliedFilters, "workstream");
  const [selectedTeam = defaultOptionType] = getFilterValue(appliedFilters, "team");
  const [selectedIssueType = defaultOptionType] = getFilterValue(appliedFilters, "issuetype");
  const selectedStateValues = getFilterValue(appliedFilters, "state");

  // other states
  const [exclude, setExclude] = React.useState(false);
  const [wipChartType, setWipChartType] = React.useState("queue");

  const callBacks = {setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters};

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
      setAppliedFilters((prev) => ({...prev, currentInteraction: ["zoom_selection", {selectedChartData: items}]}));
    }
    if (eventType === EVENT_TYPES.RESET_ZOOM_SELECTION) {
      setAppliedFilters((prev) => ({...prev, currentInteraction: ["zoom_reset_selection"]}));
    }
  }

  function handleResetAll() {
    setAppliedFilters(EmptyObj);
    // reset chart components state
    resetComponentState();
  }

  function handleClearClick() {
    setAppliedFilters(EmptyObj);
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
        setAppliedFilters((prev) => ({
          ...prev,
          category: ["engineering"],
          currentInteraction: ["histogram", {histogramBucket: category, selectedChartData: bucket}],
        }));
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
        setAppliedFilters((prev) => ({
          ...prev,
          category: ["delivery"],
          currentInteraction: ["histogram", {histogramBucket: category, selectedChartData: bucket}],
        }));
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
          setAppliedFilters((prev) => ({
            ...prev,
            quadrantpanel: [quadrant],
            category: ["engineering"],
            currentInteraction: ["quadrant"],
          }));
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
          setAppliedFilters((prev) => ({
            ...prev,
            quadrantpanel: [quadrant],
            category: ["delivery"],
            currentInteraction: ["quadrant"],
          }));
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
    if (currentInteraction === "queuesize") {
      selectedFilter = selectedQueueName;
    }
    const ageFilterElement = <AgeFilterWrapper selectedFilter={selectedFilter} handleClearClick={handleClearClick} />;

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
            setAppliedFilters((prev) => ({
              ...prev,
              category: ["engineering"],
              currentInteraction: ["queuesize"],
              state: [{value: obj.options.name, label: obj.options.name}],
            }));
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
            setAppliedFilters((prev) => ({
              ...prev,
              category: ["delivery"],
              currentInteraction: ["queuesize"],
              state: [{value: obj.options.name, label: obj.options.name}],
            }));
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
                const {workstream, currentInteraction, ...newPrev} = prev;
                if (item.value === defaultOptionType.value) {
                  return newPrev;
                }
                return {...prev, workstream: [item], currentInteraction: ["dropdown"]};
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
                const {team, currentInteraction, ...newPrev} = prev;
                if (item.value === defaultOptionType.value) {
                  return newPrev;
                }
                return {...prev, team: [item], currentInteraction: ["dropdown"]};
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
                const {issuetype, currentInteraction, ...newPrev} = prev;
                if (item.value === defaultOptionType.value) {
                  return newPrev;
                }
                return {...prev, issuetype: [item], currentInteraction: ["dropdown"]};
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
                  const {category: category1, ...newPrev} = prev;
                  const {state, category, currentInteraction, ...newPrev2} = prev;

                  if (values.length > 0) {
                    // remove category filter from here
                    return {
                      ...newPrev,
                      state: values,
                      currentInteraction: ["dropdown"],
                    };
                  } else {
                    // remove category, state, currentInteraction filter from here
                    return newPrev2;
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
          {Object.keys(appliedFilters).length > 0 && (
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
