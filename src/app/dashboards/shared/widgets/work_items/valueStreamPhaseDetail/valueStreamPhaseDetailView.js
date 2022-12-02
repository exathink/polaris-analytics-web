import React, {useState} from "react";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";
import {getSelectedMetricColor, getSelectedMetricDisplayName} from "../../../helpers/metricsMeta";
import {VizItem, VizRow} from "../../../containers/layout";
import {AppTerms, WorkItemStateTypeColor, WorkItemStateTypeDisplayName, WorkItemStateTypeSortOrder} from "../../../config";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {Flex} from "reflexbox";
import "./valueStreamPhaseDetail.css";
import {getUniqItems} from "../../../../../helpers/utility";
import {Alert, Select} from "antd";
import {WorkItemScopeSelector} from "../../../components/workItemScopeSelector/workItemScopeSelector";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import {getWorkItemDurations} from "../clientSideFlowMetrics";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";
import {getHistogramSeries, isClosed} from "../../../../projects/shared/helper/utils";
import {injectIntl} from "react-intl";
import {ClearFilters} from "../../../components/clearFilters/clearFilters";
import {WorkItemsDetailHistogramTable} from "../workItemsDetailHistogramTable";
import {useSelect} from "../../../components/select/selectDropdown";
import {
  defaultIssueType,
  SelectIssueTypeDropdown,
  uniqueIssueTypes,
} from "../../../components/select/selectIssueTypeDropdown";

const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

const {Option} = Select;

const PhaseDetailView = ({
  data,
  dimension,
  targetMetrics,
  workItemScope,
  setWorkItemScope,
  workItemScopeVisible = true,
  defaultToHistogram = true,
  view,
  context,
  intl,
  fetchMore
}) => {
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const uniqWorkItemsSources = React.useMemo(
    () => getUniqItems(workItems, (item) => item.workItemsSourceKey),
    [workItems]
  );

  const updateQuery = React.useCallback(
    (prevResult, {fetchMoreResult}) => {
      const mergedEdges = [...prevResult[dimension].workItems.edges, ...fetchMoreResult[dimension].workItems.edges];
      const merged = {
        [dimension]: {
          ...fetchMoreResult[dimension],
          workItems: {
            ...fetchMoreResult[dimension].workItems,
            edges: mergedEdges,
          },
        },
      };
      return merged;
    },
    [dimension]
  );

  const {pageInfo = {}, count} = data?.[dimension]?.["workItems"];
  const paginationOptions = {
    ...pageInfo,
    count,
    fetchMore,
    updateQuery
  };
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  
  const [selectedTeam, setSelectedTeam] = React.useState("All");

  const [selectedFilter, setFilter] = React.useState(null);
  const [selectedMetric, setSelectedMetric] = React.useState(null);


  const uniqueTeams = ["All", ...new Set(workItems.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

  function handleTeamChange(index) {
    setSelectedTeam(uniqueTeams[index]);
  }

  function selectTeamDropdown() {
    return (
      <div data-testid="pipeline-state-details-team-dropdown" className={"control"}>
        <div className="controlLabel">Team</div>
        <Select defaultValue={0} onChange={handleTeamChange} className="tw-w-24 lg:tw-w-36">
          {uniqueTeams.map((teamName, index) => (
            <Option key={teamName} value={index}>
              {teamName}
            </Option>
          ))}
        </Select>
      </div>
    );
  }

  const {selectedVal: {key: selectedIssueType}, valueIndex: issueTypeValueIndex, handleChange: handleIssueTypeChange} = useSelect({
    uniqueItems: uniqueIssueTypes,
    defaultVal: defaultIssueType,
  });

  /* Index the candidates by state type. These will be used to populate each tab */
  const workItemsByStateType = React.useMemo(
    () =>
      workItems.reduce((workItemsByStateType, workItem) => {
        if (workItemsByStateType[workItem.stateType] != null) {
          workItemsByStateType[workItem.stateType].push(workItem);
        } else {
          workItemsByStateType[workItem.stateType] = [workItem];
        }
        return workItemsByStateType;
      }, {}),
    [workItems]
  );
  const stateTypes = Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  );

  const [selectedStateType, setSelectedStateType] = useState(
    /* priority order to select the default open tab when we first render this component */
    ["closed", "wip", "complete", "open", "backlog"].find(
      (stateType) => workItemsByStateType[stateType] && workItemsByStateType[stateType].length > 0
    ) || stateTypes[0]
  );

  const defaultSelectedGrouping = defaultToHistogram ? "responseTime" : "table";
  const [selectedGrouping, setSelectedGrouping] = useState(defaultSelectedGrouping);

  const candidateWorkItems = React.useMemo(() => {
    if (selectedStateType != null && workItemsByStateType[selectedStateType] != null) {
      return workItemsByStateType[selectedStateType].filter((w) => {
        if (selectedIssueType === "all") {
          return true;
        } else {
          return w.workItemType === selectedIssueType;
        }
      }).filter((w) => {
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
  }, [selectedStateType, workItemsByStateType, selectedTeam, selectedIssueType]);

  const [resetComponentStateKey, resetComponentState] = useResetComponentState();

  React.useEffect(() => {
    if (selectedFilter === null) {
      setSelectedGrouping(defaultSelectedGrouping);
    }
  }, [selectedFilter, defaultSelectedGrouping]);

  function resetFilterAndMetric() {
    // clear bucket and clear series
    setFilter(null);
    setSelectedMetric(null);
  }

  function handleClearClick() {
    resetFilterAndMetric();
    resetComponentState();
  }

  function getChartSubTitle() {
    const specsOnly = workItemScope === "specs";
    return `${specsOnly ? AppTerms.specs.display: `All ${AppTerms.cards.display}`} in ${WorkItemStateTypeDisplayName[selectedStateType]}`;
  }

  const seriesData = React.useMemo(() => {
    const specsOnly = workItemScope === "specs";
    const workItemsWithAggregateDurations = getWorkItemDurations(candidateWorkItems);

    const pointsLeadTimeOrAge = workItemsWithAggregateDurations.map((w) =>
      isClosed(selectedStateType) ? w["leadTime"] : w["cycleTime"]
    );
    const pointsCycleTimeOrLatency = workItemsWithAggregateDurations.map((w) =>
      isClosed(selectedStateType) ? w["cycleTime"] : w["latency"]
    );
    const pointsEffort = workItemsWithAggregateDurations.map((w) => w["effort"]);

    const seriesLeadTimeOrAge = getHistogramSeries({
      id: "leadTimeOrAge",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pointsLeadTimeOrAge,
      name: getSelectedMetricDisplayName("leadTimeOrAge", selectedStateType),
      color: getSelectedMetricColor("leadTimeOrAge", selectedStateType),
      visible: (isClosed(selectedStateType) && specsOnly === false) || !isClosed(selectedStateType),
    });
    const seriesCycleTimeOrLatency = getHistogramSeries({
      id: "cycleTimeOrLatency",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pointsCycleTimeOrLatency,
      name: getSelectedMetricDisplayName("cycleTimeOrLatency", selectedStateType),
      color: getSelectedMetricColor("cycleTimeOrLatency", selectedStateType),
      visible: isClosed(selectedStateType) && specsOnly === true,
    });
    const seriesEffort = getHistogramSeries({
      id: "effort",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pointsEffort,
      name: getSelectedMetricDisplayName("effort", selectedStateType),
      color: getSelectedMetricColor("effort", selectedStateType),
      visible: false,
    });

    return [seriesLeadTimeOrAge, seriesCycleTimeOrLatency, seriesEffort];
  }, [candidateWorkItems, workItemScope, intl, selectedStateType]);

  if (selectedStateType != null) {
    const workItemsWithAggregateDurations = getWorkItemDurations(candidateWorkItems);
    return (
      <VizRow h={1}>
        <VizItem w={1} style={{height: "93%"}}>
          <div className={"workItemStateDetailsControlWrapper"}>
            <div className={"leftControls"}>
              <div className="selectTeam">{selectTeamDropdown()}</div>
              <div className="tw-ml-4">
                <SelectIssueTypeDropdown
                  valueIndex={issueTypeValueIndex}
                  handleIssueTypeChange={handleIssueTypeChange}
                  className="tw-w-24 lg:tw-w-36"
                />
              </div>
            </div>
            <div className={"middleControls"}>
              <GroupingSelector
                label={`Phase: ${WorkItemStateTypeDisplayName[selectedStateType]}`}
                groupings={stateTypes.map((stateType) => ({
                  key: stateType,
                  display: WorkItemStateTypeDisplayName[stateType],
                  style: {
                    backgroundColor: WorkItemStateTypeColor[stateType],
                    color: "#ffffff",
                  },
                }))}
                initialValue={selectedStateType}
                onGroupingChanged={(stateType) => {
                  setSelectedStateType(stateType);
                  resetFilterAndMetric();
                }}
                layout="col"
                className="tw-ml-4"
              />
              {selectedFilter != null && (
                <div className="tw-ml-6">
                  <ClearFilters
                    selectedFilter={selectedFilter}
                    selectedMetric={selectedMetric}
                    stateType={selectedStateType}
                    handleClearClick={handleClearClick}
                  />
                </div>
              )}
            </div>
            <div className={"rightControls"}>
              <div className="workItemScopeSelector">
                {workItemScopeVisible && (
                  <WorkItemScopeSelector
                    className={"specsAllSelector"}
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                    layout="col"
                  />
                )}
              </div>
              <div className="groupView">
                <GroupingSelector
                  label={"View"}
                  className={"groupCardsBySelector"}
                  groupings={[
                    {key: "responseTime", display: `Histogram`},
                    {key: "table", display: "Card Detail"},
                  ].map((item) => ({
                    key: item.key,
                    display: item.display,
                  }))}
                  initialValue={selectedGrouping}
                  value={selectedGrouping}
                  onGroupingChanged={setSelectedGrouping}
                  layout="col"
                />
              </div>
            </div>
          </div>

          <WorkItemsDetailHistogramTable
            // common props
            key={resetComponentStateKey}
            stateType={selectedStateType}
            tabSelection={selectedGrouping}
            colWidthBoundaries={COL_WIDTH_BOUNDARIES}
            // chart props
            chartSubTitle={getChartSubTitle()}
            specsOnly={workItemScope === "specs"}
            series={seriesData}
            onPointClick={({category, selectedMetric}) => {
              setSelectedMetric(selectedMetric);
              setFilter(category);
              setSelectedGrouping("table");
            }}
            clearFilters={resetFilterAndMetric}
            // table props
            view={view}
            selectedFilter={selectedFilter}
            tableData={workItemsWithAggregateDurations}
            tableSelectedMetric={selectedMetric}
            setShowPanel={setShowPanel}
            setWorkItemKey={setWorkItemKey}
            paginationOptions={paginationOptions}
          />
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
export const ValueStreamPhaseDetailView = withNavigationContext(injectIntl(PhaseDetailView));
