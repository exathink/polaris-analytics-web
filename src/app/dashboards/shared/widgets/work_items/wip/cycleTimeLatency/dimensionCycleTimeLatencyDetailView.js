import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {isObjectEmpty} from "../../../../../projects/shared/helper/utils";
import {WorkItemStateTypeDisplayName, WorkItemStateTypes} from "../../../../config";
import {getWorkItemDurations} from "../../clientSideFlowMetrics";
import styles from "./cycleTimeLatency.module.css";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {Button} from "antd";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {getQuadrant} from "./cycleTimeLatencyUtils";
import {EVENT_TYPES} from "../../../../../../helpers/utility";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {joinTeams} from "../../../../helpers/teamUtils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";

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
  data,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  workItemScope,
  setWorkItemScope,
  specsOnly,
  tooltipType,
  view,
  context,
}) => {
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  const [placement, setPlacement] = React.useState("top");
  const [appliedFilters, setAppliedFilters] = React.useState(EmptyObj);

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
          latencyTarget,
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

  function handleResetAll() {
    // reset table component state
    setTableFilteredWorkItems(initWorkItems);
    setAppliedFilters(EmptyObj);

    // reset chart components state
    resetComponentState();
  }

  return (
    <div className={styles.cycleTimeLatencyDashboard}>
      <div className={styles.workItemScope}>
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
      </div>
      <div className={styles.resetAllButton}>
        {(tableFilteredWorkItems.length < initWorkItems.length ||
          chartFilteredWorkItems.length < initWorkItems.length) && (
          <Button onClick={handleResetAll} type="secondary" size="small" className={styles.resetAll}>
            Clear Filters
          </Button>
        )}
      </div>
      <div className={styles.engineering}>
        <WorkItemsCycleTimeVsLatencyChart
          key={resetComponentStateKey}
          view={view}
          stageName={"Coding"}
          specsOnly={specsOnly}
          workItems={chartFilteredWorkItems}
          stateTypes={engineeringStateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          tooltipType={tooltipType}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <div className={styles.delivery}>
        <WorkItemsCycleTimeVsLatencyChart
          key={resetComponentStateKey}
          view={view}
          stageName={"Delivery"}
          specsOnly={specsOnly}
          workItems={chartFilteredWorkItems}
          stateTypes={deliveryStateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          tooltipType={tooltipType}
          onSelectionChange={handleSelectionChange}
        />
      </div>
      <div className={styles.cycleTimeLatencyTable}>
        <CycleTimeLatencyTable
          tableData={getWorkItemDurations(tableFilteredWorkItems)}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          callBacks={callBacks}
          appliedFilters={appliedFilters}
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
