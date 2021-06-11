import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../shared/charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {useGenerateTicks} from "../../../../shared/hooks/useGenerateTicks";
import {isObjectEmpty} from "../../helper/utils";
import {WorkItemStateTypeDisplayName, WorkItemStateTypes} from "../../../../shared/config";
import {getWorkItemDurations} from "../../../../shared/charts/workItemCharts/shared";
import styles from "./cycleTimeLatency.module.css";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {CardInspectorWidget} from "../../../../work_items/cardInspector/cardInspectorWidget";
import {Drawer} from "antd";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";
import {EVENT_TYPES} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {getQuadrantColor} from "./cycleTimeLatencyUtils";

const engineeringStateTypes = [WorkItemStateTypes.open, WorkItemStateTypes.make];
const deliveryStateTypes = [WorkItemStateTypes.deliver];

export const CycleTimeLatencyDetailView = ({
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
  const tick = useGenerateTicks(2, 60000);

  const [showPanel, setShowPanel] = React.useState(false);
  const [workItemKey, setWorkItemKey] = React.useState();
  const [placement, setPlacement] = React.useState();
  const [appliedFilters, setAppliedFilters] = React.useState({});

  const callBacks = {setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters};

  const applyFiltersTest = React.useCallback(
    (node) => {
      const [nodeWithAggrDurations] = getWorkItemDurations([node]);
      const calculatedColumns = {
        stateType: WorkItemStateTypeDisplayName[node.stateType],
        quadrant: getQuadrantColor({
          cycleTime: nodeWithAggrDurations.cycleTime,
          latency: nodeWithAggrDurations.latency,
          cycleTimeTarget,
          latencyTarget,
        }),
      };
      const newNode = {...node, ...calculatedColumns};
      const localAppliedFilters = appliedFilters || {};
      if (isObjectEmpty(localAppliedFilters)) {
        return true;
      } else {
        const entries = Object.entries(localAppliedFilters).filter(([_, filterVals]) => filterVals != null);
        return entries.every(([filterKey, filterVals]) =>
          filterVals.some((filterVal) => {
            const re = new RegExp(filterVal, "i");
            return newNode[filterKey].indexOf(filterVal) === 0 || newNode[filterKey].match(re);
          })
        );
      }
    },
    [appliedFilters, cycleTimeTarget, latencyTarget]
  );

  const initialWorkItems = React.useMemo(() => {
    const edges = data?.["project"]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data]);
  const initialTableData = getWorkItemDurations(initialWorkItems);

  const workItems = React.useMemo(() => {
    const edges = data?.["project"]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node).filter(applyFiltersTest);
  }, [data, applyFiltersTest]);

  function getCardInspectorPanel() {
    return (
      workItemKey && (
        <Drawer
          placement={placement}
          height={355}
          closable={false}
          onClose={() => setShowPanel(false)}
          visible={showPanel}
          key={workItemKey}
        >
          <CardInspectorWidget context={context} workItemKey={workItemKey} />
        </Drawer>
      )
    );
  }

  return (
    <div className={styles.cycleTimeLatencyDashboard}>
      <div className={styles.workItemScope}>
        <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
      </div>
      <div className={styles.engineering}>
        <WorkItemsCycleTimeVsLatencyChart
          view={view}
          stageName={"Engineering"}
          specsOnly={specsOnly}
          workItems={workItems}
          stateTypes={engineeringStateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          tick={tick}
          tooltipType={tooltipType}
          onSelectionChange={(items, eventType) => {
            if (eventType === EVENT_TYPES.POINT_CLICK) {
              setPlacement("bottom");
              setWorkItemKey(items[0].key);
              setShowPanel(true);
            }
          }}
        />
      </div>
      <div className={styles.delivery}>
        <WorkItemsCycleTimeVsLatencyChart
          view={view}
          stageName={"Delivery"}
          specsOnly={specsOnly}
          workItems={workItems}
          stateTypes={deliveryStateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          tick={tick}
          tooltipType={tooltipType}
          onSelectionChange={(items, eventType) => {
            if (eventType === EVENT_TYPES.POINT_CLICK) {
              setPlacement("bottom");
              setWorkItemKey(items[0].key);
              setShowPanel(true);
            }
          }}
        />
      </div>
      <div className={styles.cycleTimeLatencyTable}>
        <CycleTimeLatencyTable
          tableData={initialTableData}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          callBacks={callBacks}
          appliedFilters={appliedFilters}
        />
      </div>
      <div className={styles.cardInspectorPanel}>{getCardInspectorPanel()}</div>
    </div>
  );
};
