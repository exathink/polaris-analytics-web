import React from "react";
import {pick} from "../../../../../../helpers/utility";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {WorkItemStateTypes} from "../../../../config";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function CardDetailsView({data, dimension, view, context, workItemTypeFilter, supportsFilterOnCard, specsOnly}) {
  const tableData = React.useMemo(() => {
    const edgeNodes = data?.[dimension]?.workItemDeliveryCycles?.edges ?? [];
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
  }, [data, dimension]);
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <div className="tw-h-full tw-w-full">
      <WorkItemsDetailTable
        key={workItemTypeFilter}
        view={view}
        stateType={WorkItemStateTypes.closed}
        tableData={tableData}
        selectedFilter={workItemTypeFilter}
        setShowPanel={setShowPanel}
        setWorkItemKey={setWorkItemKey}
        colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        supportsFilterOnCard={supportsFilterOnCard}
        specsOnly={specsOnly}
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
