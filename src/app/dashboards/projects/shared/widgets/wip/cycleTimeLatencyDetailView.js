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
import {getQuadrantColor} from "./cycleTimeLatencyUtils";
import {EVENT_TYPES} from "../../../../../helpers/utility";

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
  const [appliedFilters, setAppliedFilters] = React.useState(EmptyObj);

  const callBacks = {setShowPanel, setWorkItemKey, setPlacement, setAppliedFilters};

  const localAppliedFilters = getSanitizedFilters(appliedFilters);
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
    [localAppliedFilters, cycleTimeTarget, latencyTarget]
  );

  const [initItems, engItems, delItems] = React.useMemo(() => {
    const edges = data?.["project"]?.["workItems"]?.["edges"] ?? [];
    const initData = edges.map((edge) => edge.node);
    const [engineeringItems, deliveryItems] = [
      initData.filter((x) => engineeringStateTypes.indexOf(x.stateType) !== -1),
      initData.filter((x) => deliveryStateTypes.indexOf(x.stateType) !== -1),
    ];
    return [initData, engineeringItems, deliveryItems];
  }, [data]);

  const [engineeringItems, setEngineeringItems] = React.useState(() => getWorkItemDurations(engItems));
  const [deliveryItems, setDeliveryItems] = React.useState(() => getWorkItemDurations(delItems));

  React.useEffect(() => {
    const [engineeringItems, deliveryItems] = [
      initItems.filter((x) => engineeringStateTypes.indexOf(x.stateType) !== -1),
      initItems.filter((x) => deliveryStateTypes.indexOf(x.stateType) !== -1),
    ];

    setEngineeringItems(getWorkItemDurations(engineeringItems));
    setDeliveryItems(getWorkItemDurations(deliveryItems));
  }, [initItems])

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
            if (eventType === EVENT_TYPES.ZOOM_SELECTION) {
              setEngineeringItems(items);
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
            if (eventType === EVENT_TYPES.ZOOM_SELECTION) {
              setDeliveryItems(items);
            }
          }}
        />
      </div>
      <div className={styles.cycleTimeLatencyTable}>
        <CycleTimeLatencyTable
          tableData={engineeringItems.concat(deliveryItems)}
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
