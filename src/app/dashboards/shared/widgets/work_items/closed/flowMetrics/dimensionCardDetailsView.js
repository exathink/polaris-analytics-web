import React from "react";
import {TABLE_PAGINATION} from "../../../../../../../config/featureFlags";
import {pick, useFeatureFlag} from "../../../../../../helpers/utility";
import {useUpdateQuery} from "../../../../../projects/shared/helper/hooks";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import { useSelect } from "../../../../components/select/selectDropdown";
import { defaultIssueType, SelectIssueTypeDropdown, uniqueIssueTypes } from "../../../../components/select/selectIssueTypeDropdown";
import { defaultTeam, SelectTeamDropdown, getAllUniqueTeams } from "../../../../components/select/selectTeamDropdown";

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
  const {selectedVal: {key: selectedIssueType}, valueIndex: issueTypeValueIndex, handleChange: handleIssueTypeChange} = useSelect({
    uniqueItems: uniqueIssueTypes,
    defaultVal: defaultIssueType,
  });
  const teams = [...new Set(getData(data, dimension).flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))].map((t) => ({
    key: t,
    name: t,
  }));
  const uniqueTeams = getAllUniqueTeams(teams);
  const {selectedVal: {key: selectedTeam}, valueIndex: teamValueIndex, handleChange: handleTeamChange} = useSelect({
    uniqueItems: uniqueTeams,
    defaultVal: defaultTeam,
  });

  const tableData = React.useMemo(() => {
    const newData = getData(data, dimension);
    return newData.filter((w) => {
      if (selectedIssueType === "all") {
        return true;
      } else {
        return w.workItemType === selectedIssueType;
      }
    }).filter((w) => {
      if (selectedTeam === "all") {
        return true;
      } else {
        return w.teamNodeRefs.map((t) => t.teamName).indexOf(selectedTeam) > -1;
      }
    });
  }, [data, dimension, selectedIssueType, selectedTeam]);

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
    <div className="tw-relative tw-h-full  tw-w-full">
      <div className="tw-absolute tw-top-[-3.5rem] tw-left-0 tw-mx-4 tw-flex tw-items-end tw-justify-between">
        <SelectTeamDropdown
          uniqueTeams={uniqueTeams}
          valueIndex={teamValueIndex}
          handleTeamChange={handleTeamChange}
          wrapperClassName="tw-ml-2"
          className="tw-w-36"
         />
        <SelectIssueTypeDropdown
          valueIndex={issueTypeValueIndex}
          handleIssueTypeChange={handleIssueTypeChange}
          wrapperClassName="tw-ml-2"
          className="tw-w-36"
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
