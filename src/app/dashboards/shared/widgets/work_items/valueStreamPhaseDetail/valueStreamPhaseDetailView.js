import React, {useState} from "react";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../helpers/metricsMeta";
import {VizItem, VizRow} from "../../../containers/layout";
import {WorkItemStateTypeColor, WorkItemStateTypeDisplayName, WorkItemStateTypeSortOrder} from "../../../config";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {Flex} from "reflexbox";
import "./valueStreamPhaseDetail.css";
import {capitalizeFirstLetter, getUniqItems} from "../../../../../helpers/utility";
import {Alert, Select} from "antd";
import {WorkItemScopeSelector} from "../../../components/workItemScopeSelector/workItemScopeSelector";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import {ValueStreamPhaseDetailTable} from "./valueStreamPhaseDetailTable";
import {getWorkItemDurations} from "../clientSideFlowMetrics";
import { WorkItemsDurationsHistogramChart } from "../../../charts/workItemCharts/workItemsDurationsHistogramChart";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

const {Option} = Select;

const PhaseDetailView = ({
  data,
  dimension,
  targetMetrics,
  workItemScope,
  setWorkItemScope,
  workItemScopeVisible = true,
  view,
  context,
}) => {
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
  const [selectedTeam, setSelectedTeam] = React.useState("All");

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
        <div className="controlLabel">Workstream</div>
        <Select
          defaultValue={0}
          onChange={handleChange}
          getPopupContainer={(node) => node.parentNode}
          className={"workStreamSelector"}
        >
          {uniqWorkItemsSourcesWithDefault.map(({workItemsSourceKey, workItemsSourceName}, index) => (
            <Option key={workItemsSourceKey} value={index}>
              {workItemsSourceName}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  const uniqueTeams = ["All", ...new Set(workItems.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

  function handleTeamChange(index) {
    setSelectedTeam(uniqueTeams[index]);
  }

  function selectTeamDropdown() {
    return (
      <div data-testid="pipeline-state-details-team-dropdown" className={"control"}>
        <div className="controlLabel">Team</div>
        <Select defaultValue={0} onChange={handleTeamChange} className={"teamSelector"}>
          {uniqueTeams.map((teamName, index) => (
            <Option key={teamName} value={index}>
              {teamName}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  /* Index the candidates by state type. These will be used to populate each tab */
  const workItemsByStateType = React.useMemo(
    () =>
      filteredWorkItemsBySource.reduce((workItemsByStateType, workItem) => {
        if (workItemsByStateType[workItem.stateType] != null) {
          workItemsByStateType[workItem.stateType].push(workItem);
        } else {
          workItemsByStateType[workItem.stateType] = [workItem];
        }
        return workItemsByStateType;
      }, {}),
    [filteredWorkItemsBySource]
  );
  const stateTypes = Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  );

  const [selectedStateType, setSelectedStateType] = useState(
    /* priority order to select the default open tab when we first render this component */
    ["wip", "complete", "open", "closed", "backlog"].find(
      (stateType) => workItemsByStateType[stateType] && workItemsByStateType[stateType].length > 0
    ) || stateTypes[0]
  );
  const [selectedGrouping, setSelectedGrouping] = useState("leadTime");

  const candidateWorkItems = React.useMemo(() => {
    if (selectedStateType != null && workItemsByStateType[selectedStateType] != null) {
      return workItemsByStateType[selectedStateType].filter((w) => {
        if (selectedTeam === "All") {
          return true;
        } else {
          const _teams = w.teamNodeRefs.map((t) => t.teamName);
          return _teams.includes(selectedTeam);
        }
      });
    } else {
      return [];
    }
  }, [selectedStateType, workItemsByStateType, selectedTeam]);

  if (selectedStateType != null) {
    const workItemsWithAggregateDurations = getWorkItemDurations(candidateWorkItems);
    return (
      <VizRow h={1}>
        <VizItem w={1}>
          <div className={"workItemStateDetailsControlWrapper"}>
            <div className={"leftControls"}>
              <div className="selectWorkItemSource">{selectDropdown()}</div>
              <div className="selectTeam">{selectTeamDropdown()}</div>
            </div>
            <div className={"phaseSelector"}>
              <GroupingSelector
                label={"Phase"}
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

            <div className={"rightControls"}>
              <div className="workItemScopeSelector">
                {workItemScopeVisible && (
                  <WorkItemScopeSelector
                    className={"specsAllSelector"}
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                  />
                )}
              </div>
              <div className="groupView">
                <GroupingSelector
                  label={"View"}
                  className={"groupCardsBySelector"}
                  groupings={[
                    {key: "leadTime", display: "Lead Time"},
                    {key: "cycleTime", display: "Cycle Time"},
                    {key: "table", display: "Table"},
                  ].map((item) => ({
                    key: item.key,
                    display: item.display,
                  }))}
                  initialValue={selectedGrouping}
                  onGroupingChanged={setSelectedGrouping}
                />
              </div>
            </div>
          </div>
          {selectedGrouping !== "table" && (
            <WorkItemsDurationsHistogramChart
              workItems={candidateWorkItems}
              selectedMetric={selectedGrouping}
              colWidthBoundaries={COL_WIDTH_BOUNDARIES}
              metricsMeta={projectDeliveryCycleFlowMetricsMeta}
            />
          )}
          {selectedGrouping === "table" && (
            <ValueStreamPhaseDetailTable
              view={view}
              stateType={selectedStateType}
              tableData={workItemsWithAggregateDurations}
              setShowPanel={setShowPanel}
              setWorkItemKey={setWorkItemKey}
            />
          )}
        </VizItem>
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          context={context}
        />
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
