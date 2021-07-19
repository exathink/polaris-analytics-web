import React, {useState} from "react";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";
import {WorkItemsDurationsByPhaseChart} from "../../../charts/workItemCharts/workItemsDurationsByPhaseChart";
import {VizItem, VizRow} from "../../../containers/layout";
import {WorkItemStateTypeColor, WorkItemStateTypeDisplayName, WorkItemStateTypeSortOrder, WorkItemStateTypes} from "../../../config";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {Flex} from "reflexbox";
import "./valueStreamPhaseDetail.css";
import {capitalizeFirstLetter, getUniqItems} from "../../../../../helpers/utility";
import {Alert, Select} from "antd";
import {WorkItemScopeSelector} from "../../../components/workItemScopeSelector/workItemScopeSelector";
import { CardInspectorWithDrawer, useCardInspector } from "../../../../work_items/cardInspector/cardInspectorUtils";

const {Option} = Select;

const PhaseDetailView = ({data, dimension, targetMetrics, workItemScope, setWorkItemScope, workItemScopeVisible=true, view, context}) => {
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const uniqWorkItemsSources = React.useMemo(() => getUniqItems(workItems, (item) => item.workItemsSourceKey), [
    workItems,
  ]);
  const uniqWorkItemsSourcesWithDefault = [
    {workItemsSourceKey: "all", workItemsSourceName: "All"},
    ...uniqWorkItemsSources,
  ];
  
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const [selectedSourceKey, setSelectedSourceKey] = React.useState("all");

  const filteredWorkItemsBySource = React.useMemo(
    () =>
      selectedSourceKey === "all" ? workItems : workItems.filter((wi) => wi.workItemsSourceKey === selectedSourceKey),
    [workItems, selectedSourceKey]
  );

  function handleChange(index) {
    setSelectedSourceKey(uniqWorkItemsSourcesWithDefault[index].workItemsSourceKey);
  }

  function selectDropdown() {
    return (
      <div data-testid="pipeline-state-details-view-dropdown" className={"control"}>
        <span className="controlLabel">Workstream</span>
        <Select  defaultValue={0} onChange={handleChange} getPopupContainer={(node) => node.parentNode} className={"workStreamSelector"}>
          {uniqWorkItemsSourcesWithDefault.map(({workItemsSourceKey, workItemsSourceName}, index) => (
            <Option key={workItemsSourceKey} value={index}>
              {workItemsSourceName}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  /* Index the candidates by state type. These will be used to populate each tab */
  const workItemsByStateType = React.useMemo(() => filteredWorkItemsBySource.reduce((workItemsByStateType, workItem) => {
    if (workItemsByStateType[workItem.stateType] != null) {
      workItemsByStateType[workItem.stateType].push(workItem);
    } else {
      workItemsByStateType[workItem.stateType] = [workItem];
    }
    return workItemsByStateType;
  }, {}), [filteredWorkItemsBySource]);
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
          <div className={'workItemStateDetailsControlWrapper'}>
            <div className={'leftControls'}>
            {selectDropdown()}
            {
              workItemScopeVisible &&
              <WorkItemScopeSelector
                className={'specsAllSelector'}
                workItemScope={workItemScope}
                setWorkItemScope={setWorkItemScope}
              />
            }
            </div>
            <div className={'phaseSelector'}>
              <GroupingSelector
                label={"Phase"}
                className={"control"}
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
            </div>
            <div className={'rightControls'}>
              <GroupingSelector
                label={"Group Cards By"}
                className={"groupCardsBySelector"}
                groupings={["state", "type"].map((grouping) => ({
                  key: grouping,
                  display: capitalizeFirstLetter(grouping),
                }))}
                initialValue={selectedGrouping}
                onGroupingChanged={setSelectedGrouping}
              />
            </div>
          </div>
          <WorkItemsDurationsByPhaseChart
            stateType={selectedStateType}
            groupBy={selectedGrouping}
            workItems={candidateWorkItems}
            title={`${candidateWorkItems.length} ${workItemScope === 'specs'? 'Specs' : 'Cards'} in ${WorkItemStateTypeDisplayName[selectedStateType]}`}
            targetMetrics={targetMetrics}
            onSelectionChange={(workItems) => {
              console.log(`Selection changed: ${workItems.length}`);
              if (workItems.length === 1) {
                setShowPanel(true);
                setWorkItemKey(workItems[0].key);
              }
            }}
          />
        </VizItem>
        <CardInspectorWithDrawer workItemKey={workItemKey} showPanel={showPanel} setShowPanel={setShowPanel} context={context} />
      </VizRow>
    );
  } else {
    return (
      uniqWorkItemsSources.length === 0 && (
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
      )
    );
  }
};
export const ValueStreamPhaseDetailView = withNavigationContext(PhaseDetailView);
