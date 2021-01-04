import React, {useState} from "react";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";
import {WorkItemsDurationsByPhaseChart} from "../../../../shared/charts/workItemCharts/workItemsDurationsByPhaseChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
} from "../../../../shared/config";
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";
import {Flex} from "reflexbox";
import "./projectWorkItemStateDetails.css";
import {capitalizeFirstLetter} from "../../../../../helpers/utility";
import WorkItems from "../../../../work_items/context";
import {Alert, Select} from "antd";
const {Option} = Select;

function getUniqWorkItemsSources(workItems) {
  return [...new Set(workItems.map((w) => w.workItemsSourceKey))].map((wiSourceKey) => {
    const {workItemsSourceKey, workItemsSourceName} = workItems.find((wi) => wi.workItemsSourceKey === wiSourceKey);
    return {workItemsSourceKey, workItemsSourceName};
  });
}

const WorkItemStateDetailsView = ({workItems, projectCycleMetrics, view, context}) => {
  const uniqWorkItemsSources = React.useMemo(() => getUniqWorkItemsSources(workItems), [workItems]);
  const uniqWorkItemsSourcesWithDefault = [
    {workItemsSourceKey: "all", workItemsSourceName: "All"},
    ...uniqWorkItemsSources,
  ];
  const [selectedSourceKey, setSelectedSourceKey] = React.useState("all");

  const filteredWorkItemsBySource =
    selectedSourceKey === "all" ? workItems : workItems.filter((wi) => wi.workItemsSourceKey === selectedSourceKey);

  function handleChange(index) {
    setSelectedSourceKey(uniqWorkItemsSourcesWithDefault[index].workItemsSourceKey);
  }

  function selectDropdown() {
    return uniqWorkItemsSources.length > 1 ? (
      <div data-testid="pipeline-state-details-view-dropdown" className="stateDetailsDropdown">
        <Select
          defaultValue={0}
          style={{width: 200}}
          onChange={handleChange}
          getPopupContainer={(node) => node.parentNode}
        >
          {uniqWorkItemsSourcesWithDefault.map(({workItemsSourceKey, workItemsSourceName}, index) => (
            <Option key={workItemsSourceKey} value={index}>
              {workItemsSourceName}
            </Option>
          ))}
        </Select>
      </div>
    ) : null;
  }

  /* Index the candidates by state type. These will be used to populate each tab */
  const workItemsByStateType = filteredWorkItemsBySource.reduce((workItemsByStateType, workItem) => {
    if (workItemsByStateType[workItem.stateType] != null) {
      workItemsByStateType[workItem.stateType].push(workItem);
    } else {
      workItemsByStateType[workItem.stateType] = [workItem];
    }
    return workItemsByStateType;
  }, {});
  const stateTypes = Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  );

  const [selectedStateType, setSelectedStateType] = useState(
    /* priority order to select the default open tab when we first render this component */
    ["wip", "complete", "open", "closed", "backlog"].find(
      (stateType) => workItemsByStateType[stateType] && workItemsByStateType[stateType].length > 0
    ) || stateTypes[0]
  );
  const [selectedGrouping, setSelectedGrouping] = useState("state");

  if (selectedStateType != null) {
    const candidateWorkItems = workItemsByStateType[selectedStateType] || [];

    return (
      <VizRow h={1}>
        <VizItem w={1}>
          <Flex w={0.95}>
            <GroupingSelector
              label={"Queue"}
              groupings={stateTypes.map((stateType) => ({
                key: stateType,
                display: WorkItemStateTypeDisplayName[stateType],
                style: {
                  backgroundColor: WorkItemStateTypeColor[stateType],
                  color: stateType === selectedStateType ? "#ffffff" : "#d4d4d4",
                },
              }))}
              initialValue={selectedStateType}
              onGroupingChanged={setSelectedStateType}
            />
            {selectDropdown()}
            <GroupingSelector
              label={"Group Work Items By"}
              groupings={["state", "type"].map((grouping) => ({
                key: grouping,
                display: capitalizeFirstLetter(grouping),
              }))}
              initialValue={selectedGrouping}
              onGroupingChanged={setSelectedGrouping}
              className={uniqWorkItemsSources.length<=1 ? "groupingSelectorShiftRight": ""}
            />
          </Flex>
          <WorkItemsDurationsByPhaseChart
            stateType={selectedStateType}
            groupBy={selectedGrouping}
            workItems={candidateWorkItems}
            title={`Work Queue:  ${WorkItemStateTypeDisplayName[selectedStateType]}`}
            projectCycleMetrics={projectCycleMetrics}
            onSelectionChange={(workItems) => {
              console.log("Selection changed: workItems.length");
              if (filteredWorkItemsBySource.length === 1) {
                context.navigate(WorkItems, workItems[0].displayId, workItems[0].key);
              }
            }}
          />
        </VizItem>
      </VizRow>
    );
  } else {
    return uniqWorkItemsSources.length===0 && (
      <VizRow h={1}>
        <VizItem w={1}>
          <Flex w={0.95} justify="space-between">
            <Alert
              message="There are no work streams in this value stream"
              type="warning"
              showIcon
              closable
              className="noWorkItemResources"
            />
          </Flex>
        </VizItem>
      </VizRow>
    );
  }
};
export const ProjectWorkItemStateDetailsView = withNavigationContext(WorkItemStateDetailsView);
