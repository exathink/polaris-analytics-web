import React from "react";
import {pick} from "../../../../../../helpers/utility";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import { useSelect } from "../../../../components/select/selectDropdown";
import { defaultIssueType, SelectIssueTypeDropdown, uniqueIssueTypes } from "../../../../components/select/selectIssueTypeDropdown";
import {WorkItemStateTypes} from "../../../../config";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function CardDetailsView({data, dimension, view, context, workItemTypeFilter, supportsFilterOnCard, specsOnly}) {
  const {selectedVal: {key: selectedIssueType}, valueIndex: issueTypeValueIndex, handleChange: handleIssueTypeChange} = useSelect({
    uniqueItems: uniqueIssueTypes,
    defaultVal: defaultIssueType,
  });

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
    ).filter((w) => {
      if (selectedIssueType === "all") {
        return true;
      } else {
        return w.workItemType === selectedIssueType;
      }
    });
  }, [data, dimension, selectedIssueType]);
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <div className="tw-relative tw-h-full  tw-w-full">
      <div className="tw-absolute tw-top-[-3.5rem] tw-left-0 tw-mx-4 tw-flex tw-items-end tw-justify-between">
        <SelectIssueTypeDropdown
          valueIndex={issueTypeValueIndex}
          handleIssueTypeChange={handleIssueTypeChange}
          className="tw-ml-2"
        />
      </div>
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
