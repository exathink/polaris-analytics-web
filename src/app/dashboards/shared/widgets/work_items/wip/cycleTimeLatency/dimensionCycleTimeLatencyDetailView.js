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
import {EVENT_TYPES, getUniqItems} from "../../../../../../helpers/utility";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {joinTeams} from "../../../../helpers/teamUtils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import classNames from "classnames";
import {
  defaultIssueType,
  SelectIssueTypeDropdown,
  uniqueIssueTypes,
} from "../../../../components/select/selectIssueTypeDropdown";
import {useSelect} from "../../../../components/select/selectDropdown";
import { defaultTeam, getAllUniqueTeams, SelectTeamDropdown } from "../../../../components/select/selectTeamDropdown";

// list of columns having search feature
const SEARCH_COLUMNS = ["name", "displayId", "teams"];

const QuadrantStateTypes = {
  engineering: "engineering",
  delivery: "delivery"
}

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

function getTitle(stageName) {
  return `Delay Analyzer`;
}

export const DimensionCycleTimeLatencyDetailView = ({
  dimension,
  data,
  stateTypes,
  stageName,
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

  const [selectedQuadrant, setSelectedQuadrant] = React.useState();
  const [quadrantStateType, setQuadrantStateType] = React.useState();

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

  function handleResetAll() {
    // reset table component state
    setTableFilteredWorkItems(initWorkItems);
    setAppliedFilters(EmptyObj);
    setSelectedQuadrant(undefined);

    setQuadrantStateType(undefined)
    // reset chart components state
    resetComponentState();
  }

  const {selectedVal: {key: selectedIssueType}, valueIndex: issueTypeValueIndex, handleChange: handleIssueTypeChange} = useSelect({
    uniqueItems: uniqueIssueTypes,
    defaultVal: defaultIssueType,
  });

  const uniqueTeams = getAllUniqueTeams(
    getUniqItems(
      initWorkItems.flatMap((x) => x.teamNodeRefs),
      (x) => x.teamKey
    ).map((x) => ({key: x.teamKey, name: x.teamName}))
  );
  const {selectedVal: {key: selectedTeam}, valueIndex: teamValueIndex, handleChange: handleTeamChange} = useSelect({
    uniqueItems: uniqueTeams,
    defaultVal: defaultTeam,
  });

  return (
    <div className={styles.cycleTimeLatencyDashboard}>
      <div className={classNames(styles.title, "tw-text-2xl")}>{getTitle(stageName)}</div>
      <div className={styles.workItemScope}>
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
      </div>
      <div className={styles.resetAllButton}>
        {(tableFilteredWorkItems.length < initWorkItems.length ||
          chartFilteredWorkItems.length < initWorkItems.length ||
          selectedQuadrant !== undefined) && (
          <Button onClick={handleResetAll} type="secondary" size="small" className={styles.resetAll}>
            Clear Filters
          </Button>
        )}
      </div>
      <div className={styles.engineering}>
        <div
          className="tw-grid tw-h-full tw-grid-cols-2 tw-grid-rows-[75%,25%] tw-gap-x-2"
          key={resetComponentStateKey}
          data-testid="wip-latency-chart-panels"
        >
          <WorkItemsCycleTimeVsLatencyChart
            view={view}
            stageName={"Coding"}
            specsOnly={specsOnly}
            workItems={
              quadrantStateType === undefined || quadrantStateType === QuadrantStateTypes.engineering
                ? chartFilteredWorkItems
                : []
            }
            stateTypes={engineeringStateTypes}
            groupByState={groupByState}
            cycleTimeTarget={cycleTimeTarget}
            latencyTarget={latencyTarget}
            tooltipType={tooltipType}
            onSelectionChange={handleSelectionChange}
            selectedQuadrant={quadrantStateType === QuadrantStateTypes.engineering ? selectedQuadrant : undefined}
          />
          <WorkItemsCycleTimeVsLatencyChart
            view={view}
            stageName={"Delivery"}
            specsOnly={specsOnly}
            workItems={
              quadrantStateType === undefined || quadrantStateType === QuadrantStateTypes.delivery
                ? chartFilteredWorkItems
                : []
            }
            stateTypes={deliveryStateTypes}
            groupByState={groupByState}
            cycleTimeTarget={cycleTimeTarget}
            latencyTarget={latencyTarget}
            tooltipType={tooltipType}
            onSelectionChange={handleSelectionChange}
            selectedQuadrant={quadrantStateType === QuadrantStateTypes.delivery ? selectedQuadrant : undefined}
          />
          <div className="tw-bg-chart">
            <QuadrantSummaryPanel
              workItems={chartFilteredWorkItems}
              stateTypes={engineeringStateTypes}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              onQuadrantClick={(quadrant) => {
                if (
                  selectedQuadrant !== undefined &&
                  selectedQuadrant === quadrant &&
                  quadrantStateType === QuadrantStateTypes.engineering
                ) {
                  handleResetAll();
                } else {
                  setSelectedQuadrant(quadrant);
                  setQuadrantStateType(QuadrantStateTypes.engineering);
                }
              }}
              selectedQuadrant={quadrantStateType === QuadrantStateTypes.engineering ? selectedQuadrant : undefined}
              className="tw-mx-auto tw-w-[98%]"
              valueFontClass="tw-text-3xl"
            />
          </div>
          <div className="tw-bg-chart">
            <QuadrantSummaryPanel
              workItems={chartFilteredWorkItems}
              stateTypes={deliveryStateTypes}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
              onQuadrantClick={(quadrant) => {
                if (
                  selectedQuadrant !== undefined &&
                  selectedQuadrant === quadrant &&
                  quadrantStateType === QuadrantStateTypes.delivery
                ) {
                  handleResetAll();
                } else {
                  setSelectedQuadrant(quadrant);
                  setQuadrantStateType(QuadrantStateTypes.delivery);
                }
              }}
              selectedQuadrant={quadrantStateType === QuadrantStateTypes.delivery ? selectedQuadrant : undefined}
              className="tw-mx-auto tw-w-[98%]"
              valueFontClass="tw-text-3xl"
            />
          </div>
        </div>
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
                quadrantStateType === undefined ||
                (quadrantStateType === QuadrantStateTypes.engineering
                  ? engineeringStateTypes.indexOf(workItem.stateType) !== -1
                  : deliveryStateTypes.indexOf(workItem.stateType) !== -1)
            )
            .filter((workItem) => (stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true))
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
