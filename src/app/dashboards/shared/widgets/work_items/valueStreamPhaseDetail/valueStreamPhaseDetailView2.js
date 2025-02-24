import React from "react";
import {buildIndex, getUniqItems} from "../../../../../helpers/utility";
import {VizItem, VizRow} from "../../../containers/layout";
import {Flex} from "reflexbox";
import {Alert, Popover} from "antd";
import {useIntl} from "react-intl";
import {WorkItemsDetailTable} from "../workItemsDetailTable";
import {applyRangeSelectionOnColumn, defaultOnGridReady} from "../../../../../components/tables/tableUtils";
import {COL_WIDTH_BOUNDARIES} from "../wip/cycleTimeLatency/cycleTimeLatencyUtils";
import {COL_TYPES} from "../../../../../components/tables/tableCols";
import {WorkItemStateTypeColor, WorkItemStateTypeSortOrder, itemsDesc} from "../../../config";
import {getWorkItemDurations} from "../clientSideFlowMetrics";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
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

const getSelectedColumnHeaderName = (gridApi, selectedColId) => {
  const columnDefs = gridApi.getColumnDefs();
  const selectedColDef = columnDefs.find((x) => x.colId === selectedColId);
  if (selectedColDef) {
    return selectedColDef.headerName;
  }
  return "";
};

function getHeaderForColumn(gridApi, colId) {
  const columnDefs = gridApi.getColumnDefs();
  const selectedColDef = columnDefs.find((x) => x.colId === colId);
  if (selectedColDef) {
    return selectedColDef.headerName;
  }
  return colId;
}

function getAllFilterModels(gridApi, existingFilters) {
  const allFilters = Object.entries(existingFilters).map(
    ([
      selectedMetric,
      {
        values: [selectedFilter],
      },
    ]) => {
      const selectedHeader = getHeaderForColumn(gridApi, selectedMetric);
      return {selectedMetric, selectedFilter: selectedFilter ?? "Unassigned", selectedHeader};
    }
  );
  return allFilters;
}

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

  // update chartData whenever specsOnly flag changes
  React.useEffect(() => {
    dispatch({type: actionTypes.Update_Current_Chart_Data, payload: candidateWorkItems});
    dispatch({type: actionTypes.Update_Selected_Bar_Data, payload: undefined});
    gridRef?.current?.api?.setFilterModel?.(null);
  }, [specsOnly, candidateWorkItems]);

  const continousValueseries = React.useMemo(() => {
    const newSelectedColId = getSelectedMetricKey(selectedColId, selectedStateType);
    const selectedColumnData = currentChartData.map((c) => c[newSelectedColId]);

    return [
      getHistogramSeries({
        id: selectedColId,
        intl,
        colWidthBoundaries: COL_WIDTH_BOUNDARIES,
        points: selectedColumnData,
        name: getSelectedMetricDisplayName(selectedColId, selectedStateType),
        color: getSelectedMetricColor(selectedColId, selectedStateType),
        visible: true,
        originalData: currentChartData,
      }),
    ];

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentChartData, intl, selectedColId, selectedStateType]);

  const onChartPointClick = (filterKey) => (params) => {
    dispatch({type: actionTypes.Update_Selected_Bar_Data, payload: params.bucket});

    // get existing filters
    const existingFilters = gridRef.current.api.getFilterModel();
    const _selectedFilter = params[filterKey] === "Unassigned" ? null : params[filterKey];
    existingFilters[selectedColId] = {values: [_selectedFilter]};
    
    const allFilters = getAllFilterModels(gridRef.current.api, existingFilters);
    setAppliedFilters(allFilters);

    gridRef.current.api.setFilterModel(existingFilters);
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
      result = getFilteredNodes(gridRef.current.api);
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

  function getClearFilters() {
    let elems = appliedFilters.map((filter) => {
      return (
        <ClearFilters
          key={filter.selectedMetric}
          selectedFilter={filter.selectedFilter}
          selectedMetric={filter.selectedHeader}
          stateType={selectedStateType}
          handleClearClick={() => {
            gridRef.current?.api?.destroyFilter?.(filter.selectedMetric);
            gridRef.current?.api.clearRangeSelection?.();
            
            const existingFilters = gridRef.current.api.getFilterModel();
            const allFilters = getAllFilterModels(gridRef.current.api, existingFilters);
            setAppliedFilters(allFilters);

            let filteredNodes = getFilteredNodes(gridRef.current.api);
            dispatch({type: actionTypes.Update_Current_Chart_Data, payload: filteredNodes});
          }}
        />
      );
    });

    let res;
    if (appliedFilters.length <= 1) {
      if (appliedFilters.length === 0) {
        res = null;
      } else {
        res = (
          <div className="tw-absolute tw-right-12 tw-top-16 tw-z-20 tw-cursor-pointer tw-bg-white tw-p-2">{elems}</div>
        );
      }
    } else {
      res = (
        <Popover content={<div className="tw-flex tw-flex-col tw-gap-4 tw-p-2">{elems}</div>} placement="bottom">
          <div className="tw-absolute tw-right-12 tw-top-16 tw-z-20 tw-cursor-pointer tw-bg-white tw-p-2">
            <div className="tw-flex tw-items-center tw-justify-center tw-gap-2">
              <div>{elems[0]}</div>
              <div className="tw-text-3xl">...</div>
            </div>
          </div>
        </Popover>
      );
    }

    return res;
  }

  function getChartElement() {
    let chartElement;
    if (COL_TYPES[selectedColId].type === "continous") {
      chartElement = (
        <WorkItemsDetailHistogramChart
          chartConfig={{
            title: `${WorkItemStateTypeDisplayName[selectedStateType]} Phase, ${selectedColHeader} Distribution`,
            subtitle: getChartSubTitle(),
            legendItemClick: () => {},
          }}
          onPointClick={onChartPointClick("category")}
          selectedMetric={getMetricsMetaKey(selectedColId, selectedStateType)}
          specsOnly={specsOnly}
          colWidthBoundaries={COL_WIDTH_BOUNDARIES}
          stateType={selectedStateType}
          series={continousValueseries}
        />
      );
    } else if (COL_TYPES[selectedColId].type === "category") {
      chartElement = (
        <ValueStreamDistributionChart
          colData={currentChartData}
          colId={selectedColId}
          onPointClick={onChartPointClick("selectedFilter")}
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
        {isChartFilterApplied() && getClearFilters()}
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

          dispatch({type: actionTypes.Update_Selected_Col_Header, payload: getSelectedColumnHeaderName(gridRef.current.api, selectedColId)});
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
            dispatch({type: actionTypes.Update_Selected_Col_Id, payload: colId});
            dispatch({type: actionTypes.Update_Selected_Col_Header, payload: getSelectedColumnHeaderName(gridRef.current.api, colId)});
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
    <div className="tw-grid tw-h-full tw-grid-rows-[5%_45%_50%] tw-gap-2">
      <div className="tw-flex tw-items-center tw-justify-between">
        <div id="dummy" className="tw-w-8 tw-h-4"></div>
        <div className="tw-flex tw-justify-center tw-ml-12">{getStateTypeGroupingTabs()}</div>
        <div className="tw-mr-20">{getWorkItemScopeElement()}</div>
      </div>

      <div>{getChartElement()}</div>
      <div>{getTableElement()}</div>
    </div>
  );
}

export const ValueStreamPhaseDetailView = withNavigationContext(PhaseDetailView);
