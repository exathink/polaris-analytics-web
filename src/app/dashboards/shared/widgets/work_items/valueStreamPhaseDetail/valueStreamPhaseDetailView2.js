import React from "react";
import {buildIndex, getUniqItems} from "../../../../../helpers/utility";
import {VizItem, VizRow} from "../../../containers/layout";
import {Flex} from "reflexbox";
import {Alert} from "antd";
import {useIntl} from "react-intl";
import {WorkItemsDetailTable} from "../workItemsDetailTable";
import {applyRangeSelectionOnColumn, defaultOnGridReady} from "../../../../../components/tables/tableUtils";
import {COL_WIDTH_BOUNDARIES} from "../wip/cycleTimeLatency/cycleTimeLatencyUtils";
import {COL_TYPES} from "../../../../../components/tables/tableCols";
import {WorkItemStateTypeColor, WorkItemStateTypeSortOrder, itemsDesc} from "../../../config";
import {getWorkItemDurations} from "../clientSideFlowMetrics";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";
import {
  getMetricsMetaKey,
  getSelectedMetricColor,
  getSelectedMetricDisplayName,
  getSelectedMetricKey,
} from "../../../helpers/metricsMeta";
import {WorkItemScopeSelector} from "../../../components/workItemScopeSelector/workItemScopeSelector";
import {useCustomPhaseMapping} from "../../../../projects/projectDashboard";
import {ClearFilters} from "../../../components/clearFilters/clearFilters";
import {WorkItemsDetailHistogramChart} from "../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {ValueStreamDistributionChart} from "./valueStreamDistributionChart";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";
import {getFilteredNodes} from "../wip/cycleTimeLatency/agGridUtils";

export const actionTypes = {
  Update_Selected_State_Type: "Update_Selected_State_Type",
  Update_Selected_Col_Id: "Update_Selected_Col_Id",
  Update_Selected_Col_Header: "Update_Selected_Col_Header",
  Update_Current_Chart_Data: "Update_Current_Chart_Data",
  Update_Selected_Bar_Data: "Update_Selected_Bar_Data",
};

export function phaseDetailReducer(state, action) {
  switch (action.type) {
    case actionTypes.Update_Selected_State_Type: {
      return {...state, selectedStateType: action.payload};
    }
    case actionTypes.Update_Selected_Col_Id: {
      return {...state, selectedColId: action.payload};
    }
    case actionTypes.Update_Selected_Col_Header: {
      return {...state, selectedColHeader: action.payload};
    }
    case actionTypes.Update_Current_Chart_Data: {
      return {...state, currentChartData: action.payload};
    }
    case actionTypes.Update_Selected_Bar_Data: {
      return {...state, selectedBarData: action.payload};
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function PhaseDetailView({dimension, data, context, workItemScope, setWorkItemScope, workItemScopeVisible}) {
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  /* Index the workItems by state type. These will be used to populate each tab */
  const workItemsByStateType = React.useMemo(() => {
    return buildIndex(workItems, (workItem) => workItem.stateType);
  }, [workItems]);

  const stateTypes = Object.keys(workItemsByStateType).sort(
    (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
  );

  const [appliedFilters, setAppliedFilters] = React.useState([]);

  /* priority order to select the default open tab when we first render this component */
  const initialSelectedStateType =
    ["closed", "wip", "complete", "open", "backlog"].find(
      (stateType) => workItemsByStateType[stateType] && workItemsByStateType[stateType].length > 0
    ) || stateTypes[0];
  const initialCandidateWorkItems = getWorkItemDurations(workItemsByStateType[initialSelectedStateType]);
  const initialState = {
    selectedStateType: initialSelectedStateType,
    // selected columnId state on table column click
    selectedColId: "state",
    selectedColHeader: "State",
    // currentChartData used to render chart
    currentChartData: initialCandidateWorkItems,
    // maintain selectedBarState, when clicked on Chart column bar
    selectedBarData: undefined,
  };

  const [
    {selectedStateType, selectedColId, selectedColHeader, currentChartData, selectedBarData},
    dispatch,
  ] = React.useReducer(phaseDetailReducer, initialState);

  const candidateWorkItems = React.useMemo(
    () => getWorkItemDurations(workItemsByStateType[selectedStateType]),
    [selectedStateType, workItemsByStateType]
  );

  const intl = useIntl();
  const gridRef = React.useRef();
  const WorkItemStateTypeDisplayName = useCustomPhaseMapping();
  const specsOnly = workItemScope === "specs";

  const [resetComponentStateKey, resetComponentState] = useResetComponentState();

  React.useEffect(() => {
    const getSelectedColumnHeaderName = () => {
      if (gridRef.current == null || gridRef.current.api == null) {
        return "State";
      }

      const columnDefs = gridRef.current.api.getColumnDefs();
      const selectedColDef = columnDefs.find((x) => x.colId === selectedColId);
      if (selectedColDef) {
        return selectedColDef.headerName;
      }
      return "";
    };

    /**
     * when we are switching between stateType tabs, table with updated colHeaders is rendered
     * those headers are not reflected using gridRef, hence we need to maintain this state.
     */
    dispatch({type: actionTypes.Update_Selected_Col_Header, payload: getSelectedColumnHeaderName()});
  }, [selectedColId, selectedStateType]);

  // update chartData whenever specsOnly flag changes
  React.useEffect(() => {
    dispatch({type: actionTypes.Update_Current_Chart_Data, payload: candidateWorkItems});
    dispatch({type: actionTypes.Update_Selected_Bar_Data, payload: undefined});
    gridRef?.current?.api?.setFilterModel?.(null);
  }, [specsOnly, candidateWorkItems]);

  const continousValueseries = React.useMemo(() => {
    const newSelectedColId = getSelectedMetricKey(selectedColId, selectedStateType);
    const selectedColumnData = currentChartData.map((c) => c[newSelectedColId]);

    return getHistogramSeries({
      id: selectedColId,
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: selectedColumnData,
      name: getSelectedMetricDisplayName(selectedColId, selectedStateType),
      color: getSelectedMetricColor(selectedColId, selectedStateType),
      visible: true,
      originalData: currentChartData,
    });

    /**
     * fixed issue with histogram chart selection not getting cleared, by using resetComponentStateKey in dep array
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChartData, intl, selectedColId, selectedStateType, resetComponentStateKey]);

  // state to maintain currently applied filters
  // maintain that in stack (appliedFilters => stack of filter objects)

  // use the filterFns infra for filtering data

  const onChartPointClick = () => (params) => {
    dispatch({type: actionTypes.Update_Selected_Bar_Data, payload: params.bucket});

    // get existing filters
    const existingFilters = gridRef.current.api.getFilterModel();
    const _selectedFilter = params.category === "Unassigned" ? null : params.category;
    existingFilters[selectedColId] = {values: [_selectedFilter]};

    const allFilters = Object.entries(existingFilters).map(
      ([
        selectedMetric,
        {
          values: [selectedFilter],
        },
      ]) => ({selectedMetric, selectedFilter})
    );
    setAppliedFilters(allFilters);

    gridRef.current.api.setFilterModel({...existingFilters, [selectedColId]: {values: [_selectedFilter]}});
  };

  const uniqWorkItemsSources = React.useMemo(
    () => getUniqItems(workItems, (item) => item.workItemsSourceKey),
    [workItems]
  );

  if (uniqWorkItemsSources.length === 0) {
    return (
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

  const isChartFilterApplied = () => selectedBarData !== undefined;
  function getChartSubTitle() {
    let result = candidateWorkItems;
    if (gridRef.current?.api) {
      result = [];
      gridRef.current?.api?.forEachNodeAfterFilter?.((node) => {
        if (!node.group) {
          result.push(node.data);
        }
      });
    }
    
    return `${result.length} ${itemsDesc(specsOnly)}`;
  }

  // here we can simply derive state to be used in render
  function getWorkItemScopeElement() {
    if (workItemScopeVisible) {
      return (
        <WorkItemScopeSelector
          className={"specsAllSelector"}
          workItemScope={workItemScope}
          setWorkItemScope={setWorkItemScope}
          layout="col"
        />
      );
    } else {
      return null;
    }
  }

  function getChartElement() {
    let chartElement;
    const clearFilterElements = appliedFilters.map((filter, index) => {
      return (
        <div
          key={filter.selectedFilter}
          className="tw-absolute tw-right-12 tw-top-0 tw-z-20 tw-cursor-pointer"
          style={{top: 50 * index}}
        >
          <ClearFilters
            selectedFilter={filter.selectedFilter}
            selectedMetric={filter.selectedMetric}
            stateType={selectedStateType}
            handleClearClick={() => {
              gridRef.current?.api?.destroyFilter?.(filter.selectedMetric);

              const existingFilters = gridRef.current.api.getFilterModel();
              const allFilters = Object.entries(existingFilters).map(
                ([
                  selectedMetric,
                  {
                    values: [selectedFilter],
                  },
                ]) => ({selectedMetric, selectedFilter})
              );
              setAppliedFilters(allFilters);

              let filteredNodes = getFilteredNodes(gridRef.current.api);
              dispatch({type: actionTypes.Update_Current_Chart_Data, payload: filteredNodes});
            }}
          />
        </div>
      );
    });

    if (COL_TYPES[selectedColId].type === "continous") {
      chartElement = (
        <WorkItemsDetailHistogramChart
          key={resetComponentStateKey}
          chartConfig={{
            title: `${WorkItemStateTypeDisplayName[selectedStateType]} Phase, ${selectedColHeader} Distribution`,
            subtitle: getChartSubTitle(),
            legendItemClick: () => {},
          }}
          onPointClick={(params) => {
            dispatch({type: actionTypes.Update_Selected_Bar_Data, payload: params.bucket});

            // get existing filters
            const existingFilters = gridRef.current.api.getFilterModel();
            const _selectedFilter = params.category === "Unassigned" ? null : params.category;
            existingFilters[selectedColId] = {values: [_selectedFilter]};

            const allFilters = Object.entries(existingFilters).map(
              ([
                selectedMetric,
                {
                  values: [selectedFilter],
                },
              ]) => ({selectedMetric, selectedFilter})
            );
            setAppliedFilters(allFilters);

            gridRef.current.api.setFilterModel({...existingFilters, [selectedColId]: {values: [_selectedFilter]}});
          }}
          selectedMetric={getMetricsMetaKey(selectedColId, selectedStateType)}
          specsOnly={specsOnly}
          colWidthBoundaries={COL_WIDTH_BOUNDARIES}
          stateType={selectedStateType}
          series={[continousValueseries]}
        />
      );
    } else if (COL_TYPES[selectedColId].type === "category") {
      chartElement = (
        <ValueStreamDistributionChart
          key={resetComponentStateKey}
          colData={currentChartData}
          colId={selectedColId}
          onPointClick={(params) => {
            dispatch({type: actionTypes.Update_Selected_Bar_Data, payload: params.bucket});

            // get existing filters
            const existingFilters = gridRef.current.api.getFilterModel();
            const _selectedFilter = params.selectedFilter === "Unassigned" ? null : params.selectedFilter;
            existingFilters[selectedColId] = {values: [_selectedFilter]};

            const allFilters = Object.entries(existingFilters).map(
              ([
                selectedMetric,
                {
                  values: [selectedFilter],
                },
              ]) => ({selectedMetric, selectedFilter})
            );
            setAppliedFilters(allFilters);

            gridRef.current.api.setFilterModel({...existingFilters, [selectedColId]: {values: [_selectedFilter]}});
          }}
          headerName={selectedColHeader}
          title={`${WorkItemStateTypeDisplayName[selectedStateType]} Phase, ${itemsDesc(
            specsOnly
          )} by ${selectedColHeader} `}
          subtitle={`${getChartSubTitle()}`}
          specsOnly={specsOnly}
          stateType={selectedStateType}
        />
      );
    }

    return (
      <>
        {isChartFilterApplied() && clearFilterElements}
        {chartElement};
      </>
    );
  }

  function getStateTypeGroupingTabs() {
    return (
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
          dispatch({type: actionTypes.Update_Selected_State_Type, payload: stateType});
          const _candidateWorkItems = getWorkItemDurations(workItemsByStateType[stateType]);
          dispatch({type: actionTypes.Update_Current_Chart_Data, payload: _candidateWorkItems});
          dispatch({type: actionTypes.Update_Selected_Bar_Data, payload: undefined});

          applyRangeSelectionOnColumn(gridRef, selectedColId);
        }}
        layout="col"
        className="tw-ml-4"
      />
    );
  }

  function getTableElement() {
    return (
      <WorkItemsDetailTable
        key={resetComponentStateKey}
        gridRef={gridRef}
        stateType={selectedStateType}
        tableData={candidateWorkItems}
        context={context}
        colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        specsOnly={specsOnly}
        onSortChanged={(params) => {
          const sortState = params.columnApi.getColumnState().find((x) => x.sort);
          const supportedCols = Object.keys(COL_TYPES);
          const colId = sortState?.colId;
          if (sortState?.sort && supportedCols.includes(colId)) {
            // only have colId state from sort click, not maintain data here, you can calculate data on render using colId
            dispatch({type: actionTypes.Update_Selected_Col_Id, payload: colId});

            let filteredNodes = getFilteredNodes(gridRef.current.api);
            dispatch({type: actionTypes.Update_Current_Chart_Data, payload: filteredNodes});
          }
        }}
        onGridReady={(params) => {
          defaultOnGridReady(params);
        }}
      />
    );
  }

  return (
    <div className="tw-grid tw-h-full tw-grid-rows-[50%_50%] tw-gap-2">
      <div className="tw-absolute tw-top-[-3.3rem] tw-left-[40%] tw-flex tw-justify-center">
        {getStateTypeGroupingTabs()}
      </div>
      <div>{getChartElement()}</div>
      <div>{getTableElement()}</div>
    </div>
  );
}

export const ValueStreamPhaseDetailView = withNavigationContext(PhaseDetailView);
