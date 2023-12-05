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
import {getMetricsMetaKey, getSelectedMetricColor, getSelectedMetricDisplayName} from "../../../helpers/metricsMeta";
import {WorkItemScopeSelector} from "../../../components/workItemScopeSelector/workItemScopeSelector";
import {useCustomPhaseMapping} from "../../../../projects/projectDashboard";
import {ClearFilters} from "../../../components/clearFilters/clearFilters";
import {WorkItemsDetailHistogramChart} from "../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {ValueStreamDistributionChart} from "./valueStreamDistributionChart";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {withNavigationContext} from "../../../../../framework/navigation/components/withNavigationContext";

function suppressAllColumnMenus({gridRef, suppressMenu}) {
  const allColumnDefs = gridRef.current?.columnApi.getAllColumns().map((column) => {
    return {
      ...column.getColDef(),
      suppressMenu: suppressMenu,
    };
  });
  gridRef.current?.api.setColumnDefs(allColumnDefs);
}

function PhaseDetailView({dimension, data, context, workItemScope, setWorkItemScope}) {
  //#region Initially have the workItems defined properly
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

  const [selectedStateType, setSelectedStateType] = React.useState(
    /* priority order to select the default open tab when we first render this component */
    ["closed", "wip", "complete", "open", "backlog"].find(
      (stateType) => workItemsByStateType[stateType] && workItemsByStateType[stateType].length > 0
    ) || stateTypes[0]
  );

  // workItems by selectedStateType
  const candidateWorkItems = React.useMemo(() => {
    return getWorkItemDurations(workItemsByStateType[selectedStateType]);
  }, [workItemsByStateType, selectedStateType]);

  //#endregion

  const intl = useIntl();
  const gridRef = React.useRef();
  const WorkItemStateTypeDisplayName = useCustomPhaseMapping();
  const specsOnly = workItemScope === "specs";

  // All the hooks and state we define here
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();

  // selected columnId state on table column click
  const [selectedColId, setSelectedColId] = React.useState("state");

  // maintain selectedBarState, when clicked on Chart column bar
  const [selectedBarState, setSelectedBarState] = React.useReducer(
    (data, partialData) => ({
      ...data,
      ...partialData,
    }),
    {selectedBarData: undefined, selectedFilter: undefined}
  );

  // derived state

  const getSelectedColumnData = React.useCallback(() => {
    // need to update few colIds based on closed/open stateTypes
    const newSelectedColId = getMetricsMetaKey(selectedColId, selectedStateType);
    return candidateWorkItems.map((c) => c[newSelectedColId]);
  }, [candidateWorkItems, selectedColId, selectedStateType]);

  const getSelectedColumnHeaderName = () => {
    if (gridRef.current == null) {
      return "State";
    }

    const columnDefs = gridRef.current.api.getColumnDefs();
    const selectedColDef = columnDefs.find((x) => x.colId === selectedColId);
    if (selectedColDef) {
      return selectedColDef.headerName;
    }
    return "";
  };
  //   const [state, dispatch] = React.useReducer(reducer, initialState);

  const continousValueseries = React.useMemo(
    () =>
      getHistogramSeries({
        id: selectedColId,
        intl,
        colWidthBoundaries: COL_WIDTH_BOUNDARIES,
        points: getSelectedColumnData(),
        name: getSelectedMetricDisplayName(selectedColId, selectedStateType),
        color: getSelectedMetricColor(selectedColId, selectedStateType),
        visible: true,
        originalData: candidateWorkItems,
      }),
    [candidateWorkItems, getSelectedColumnData, intl, selectedColId, selectedStateType]
  );

  // state to maintain currently applied filters
  // maintain that in stack (appliedFilters => stack of filter objects)

  // use the filterFns infra for filtering data

  // End

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

  const isChartFilterApplied = () => selectedBarState.selectedBarData !== undefined;
  function getChartSubTitle() {
    const result = isChartFilterApplied() ? selectedBarState.selectedBarData : candidateWorkItems;
    return `${result.length} ${itemsDesc(specsOnly)}`;
  }

  // here we can simply derive state to be used in render
  function getWorkItemScopeElement() {
    <div className="workItemScopeSelector">
      <WorkItemScopeSelector
        className={"specsAllSelector"}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        layout="col"
      />
    </div>;
  }

  function getChartElement() {
    let chartElement;
    let clearFilterElement = (
      <div className="tw-absolute tw-right-12 tw-top-0 tw-z-20">
        <ClearFilters
          selectedFilter={selectedBarState.selectedFilter}
          selectedMetric={getSelectedColumnHeaderName()}
          stateType={selectedStateType}
          handleClearClick={() => {
            setSelectedBarState({selectedBarData: undefined});
            resetComponentState();
            suppressAllColumnMenus({gridRef, suppressMenu: false});
          }}
        />
      </div>
    );

    if (COL_TYPES[selectedColId].type === "continous") {
      chartElement = (
        <WorkItemsDetailHistogramChart
          chartConfig={{
            title: `${
              WorkItemStateTypeDisplayName[selectedStateType]
            } Phase, ${getSelectedColumnHeaderName()} Distribution`,
            subtitle: getChartSubTitle(),
            legendItemClick: () => {},
          }}
          onPointClick={(params) => {
            setSelectedBarState({
              selectedBarData: params.bucket,
              selectedFilter: params.category,
            });
            suppressAllColumnMenus({gridRef, suppressMenu: true});
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
          colData={candidateWorkItems}
          colId={selectedColId}
          onPointClick={(params) => {
            setSelectedBarState({
              selectedBarData: params.bucket,
              selectedFilter: params.selectedFilter,
            });
            suppressAllColumnMenus({gridRef, suppressMenu: true});
          }}
          headerName={getSelectedColumnHeaderName()}
          title={`${WorkItemStateTypeDisplayName[selectedStateType]} Phase, ${itemsDesc(
            specsOnly
          )} by ${getSelectedColumnHeaderName()} `}
          subtitle={`${getChartSubTitle()}`}
          specsOnly={specsOnly}
          stateType={selectedStateType}
        />
      );
    }

    return (
      <>
        {isChartFilterApplied() && clearFilterElement}
        {chartElement};
      </>
    );
  }

  function getStateTypeGroupingTabs() {
    return (
      <>
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
            // main state for this callback
            setSelectedStateType(stateType);
            applyRangeSelectionOnColumn(gridRef, selectedColId);
          }}
          layout="col"
          className="tw-ml-4"
        />
      </>
    );
  }

  function getTableElement() {
    return (
      <WorkItemsDetailTable
        key={resetComponentStateKey}
        gridRef={gridRef}
        stateType={selectedStateType}
        tableData={selectedBarState.selectedBarData ?? candidateWorkItems}
        context={context}
        colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        specsOnly={true}
        onSortChanged={(params) => {
          const sortState = params.columnApi.getColumnState().find((x) => x.sort);
          const supportedCols = Object.keys(COL_TYPES);
          const colId = sortState?.colId;
          if (sortState?.sort && supportedCols.includes(colId)) {
            // only have colId state from sort click, not maintain data here, you can calculate data on render using colId
            setSelectedColId(colId);
          }
        }}
        onGridReady={(params) => {
          defaultOnGridReady(params);
        }}
      />
    );
  }
  // end

  return (
    <div>
      <div>{getWorkItemScopeElement()}</div>
      <div>{getChartElement()}</div>
      <div className="tw-flex tw-justify-center">{getStateTypeGroupingTabs()}</div>
      <div className="tw-h-full">{getTableElement()}</div>
    </div>
  );
}

export const ValueStreamPhaseDetailView = withNavigationContext(PhaseDetailView);
