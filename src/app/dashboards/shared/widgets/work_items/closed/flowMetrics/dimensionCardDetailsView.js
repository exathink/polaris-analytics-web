import React from "react";
import {TABLE_PAGINATION} from "../../../../../../../config/featureFlags";
import {pick, useFeatureFlag} from "../../../../../../helpers/utility";
import {useUpdateQuery} from "../../../../../projects/shared/helper/hooks";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";

import {WorkItemStateTypes} from "../../../../config";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

const getData = (data, dimension) => {
  const edgeNodes = data?.[dimension]?.workItemDeliveryCycles?.edges ?? [];
  return edgeNodes.map((edge) =>
    pick(
      edge.node,
      "id",
      "name",
      "url",
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
      "epicName",
      "workItemsSourceName"
    )
  );
};

export function CardDetailsView({data, dimension, view, context, workItemTypeFilter, supportsFilterOnCard, specsOnly, fetchMore}) {

  const tableData = React.useMemo(() => {
    return getData(data, dimension);
  }, [data, dimension]);

  const updateQuery = useUpdateQuery(dimension, "workItemDeliveryCycles");
  const {pageInfo = {}, count} = data?.[dimension]?.["workItemDeliveryCycles"];
  let paginationOptions = {
    ...pageInfo,
    count,
    fetchMore,
    updateQuery,
  };
  paginationOptions = useFeatureFlag(TABLE_PAGINATION, paginationOptions);

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <div className="tw-relative tw-h-full tw-w-full">
      <div className="tw-h-full">
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
          paginationOptions={paginationOptions}
        />
      </div>
      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </div>
  );
}
