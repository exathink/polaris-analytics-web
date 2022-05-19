import React from "react";
import {pick} from "../../../../../../helpers/utility";
import {useQueryProjectClosedDeliveryCycleDetail} from "../../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import { WorkItemStateTypes } from "../../../../config";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function CardDetailsWidget({
  dimension,
  instanceKey,
  days,
  specsOnly,
  defectsOnly,
  before,
  includeSubTasks,
  referenceString: latestWorkItemEvent,
  view,
  context,
  supportsFilter,
  workItemTypeFilter
}) {
  const {loading, error, data} = useQueryProjectClosedDeliveryCycleDetail({
    dimension,
    instanceKey,
    days,
    defectsOnly,
    specsOnly,
    before,
    includeSubTasks,
    referenceString: latestWorkItemEvent,
  });

  const tableData = React.useMemo(
    () =>
{
  const edgeNodes = data?.[dimension]?.workItemDeliveryCycles?.edges??[]
  return edgeNodes.map((edge) =>
    pick(
      edge.node,
      "id",
      "name",
      "key",
      "displayId",
      "workItemKey",
      "workItemType",
      "state",
      "stateType",
      "startDate",
      "endDate",
      "leadTime",
      "cycleTime",
      "latency",
      "duration",
      "effort",
      "authorCount",
      "teamNodeRefs",
      "epicName"
    )
  );
},
    [data, dimension]
  );

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <div className="tw-h-full tw-w-full">
      <WorkItemsDetailTable
        key={workItemTypeFilter}
        view={view}
        stateType={WorkItemStateTypes.closed}
        tableData={tableData}
        selectedMetric={""}
        selectedFilter={workItemTypeFilter}
        setShowPanel={setShowPanel}
        setWorkItemKey={setWorkItemKey}
        colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        supportsFilter={supportsFilter}
        loading={loading}
      />
      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </div>
  );
}
