import React from "react";
import {useIntl} from "react-intl";
import {WorkItemStateTypeDisplayName} from "../../config";
import {joinTeams} from "../../helpers/teamUtils";
import {
  AgGridStripeTable,
  parseTags,
  getOnSortChanged,
  SORTER,
  TextWithUom,
  useDefaultColDef,
  getHandleColumnVisible,
  TextWithUomColRender,
} from "../../../../components/tables/tableUtils";
import {useBlurClass} from "../../../../helpers/utility";
import {useLocalStorage} from "../../../../helpers/hooksUtil";
import {allPairs, getHistogramCategories, isClosed} from "../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../i18n";
import {
  getMetricsMetaKey,
  getSelectedMetricDisplayName,
  projectDeliveryCycleFlowMetricsMeta,
} from "../../helpers/metricsMeta";

import {CustomFloatingFilter, CustomTotalAndFilteredRowCount, MultiCheckboxFilter} from "./wip/cycleTimeLatency/agGridUtils";
import { BLANKS, getEffortCol, getStateCol, getWorkItemNameCol, getWorkItemTypeCol, useOptionalColumnsForWorkItems } from "../../../../components/tables/tableCols";
import { doesPairWiseFilterPass, getValueGetterForCorrectPair } from "./wip/cycleTimeLatency/cycleTimeLatencyUtils";
import {HIDDEN_COLUMNS_KEY} from "../../../../helpers/localStorageUtils";
import { CardInspectorWithDrawer, useCardInspector } from "../../../work_items/cardInspector/cardInspectorUtils";

function getLeadTimeOrAge(item, intl) {
  return isClosed(item.stateType) ? item.leadTime : item.cycleTime;
}

function getCycleTimeOrLatency(item, intl) {
  return isClosed(item.stateType) ? item.cycleTime : item.latency;
}

function getTransformedData(data, intl) {
  const now = new Date().getTime();

  return data.map((item, index) => {
    return {
      ...item,
      leadTimeOrAge: getLeadTimeOrAge(item, intl),
      cycleTimeOrLatency: getCycleTimeOrLatency(item, intl),
      delivery: item.latency,
      stateType: WorkItemStateTypeDisplayName[item.stateType],
      stateTypeInternal: item.stateType,
      teams: joinTeams(item),
      endDate: formatDateTime(intl, item.endDate),
      rowKey: `${now}.${index}`,
    };
  });
}

export function useWorkItemsDetailTableColumns({
  stateType,
  filters,
  selectedMetric,
  workTrackingIntegrationType,
}) {
  const blurClass = useBlurClass("tw-blur-[2px]");
  const optionalColumns = useOptionalColumnsForWorkItems({filters, workTrackingIntegrationType});

  const MenuTabs = ["filterMenuTab", "generalMenuTab"];

  let defaultOptionalCol = getEffortCol();
  if (selectedMetric === "duration") {
    defaultOptionalCol = {
      headerName: projectDeliveryCycleFlowMetricsMeta["duration"].display,
      field: "duration",
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => doesPairWiseFilterPass({value, record, metric: "duration"})
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(TextWithUom),
      comparator: SORTER.number_compare,
    };
  }
  const latencyKey = getMetricsMetaKey("latency", stateType);
  if (selectedMetric === latencyKey) {
    defaultOptionalCol = {
      headerName: getSelectedMetricDisplayName("latency", stateType),
      field: latencyKey,
      cellRenderer: React.memo(TextWithUom),
      filter: MultiCheckboxFilter,
      filterParams: {
        values: [BLANKS, ...filters.categories].map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          return doesPairWiseFilterPass({value, record, metric: latencyKey});
        },
      },
      menuTabs: MenuTabs,
      comparator: SORTER.number_compare,
    };
  }

  const columns = React.useMemo(() => [
    ...optionalColumns,
    getWorkItemNameCol(),
    getWorkItemTypeCol(),
    getStateCol({filters}),
    {
      headerName: getSelectedMetricDisplayName("leadTimeOrAge", stateType),
      field: "leadTimeOrAge",
      cellRenderer: React.memo(TextWithUomColRender),
      valueGetter: getValueGetterForCorrectPair("leadTimeOrAge"),
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["", ...filters.categories]
      },
      menuTabs: MenuTabs,
      comparator: SORTER.number_compare,
    },
    {
      headerName: getSelectedMetricDisplayName("cycleTimeOrLatency", stateType),
      field: "cycleTimeOrLatency",
      cellRenderer: React.memo(TextWithUomColRender),
      valueGetter: getValueGetterForCorrectPair("cycleTimeOrLatency"),
      filter: "agSetColumnFilter",
      filterParams: {
        values: ["", ...filters.categories]
      },
      menuTabs: MenuTabs,
      comparator: SORTER.number_compare,
    },
    defaultOptionalCol,
  ], []);

  return columns;
}

export const WorkItemsDetailTable = ({
  view,
  stateType,
  tableData,
  context,
  colWidthBoundaries,
  selectedFilter,
  selectedMetric,
  supportsFilterOnCard,
  onChange,
  loading,
  specsOnly,
  paginationOptions,
  onGridReady
}) => {
  const intl = useIntl();
  const [hidden_cols, setHiddenCols] = useLocalStorage(HIDDEN_COLUMNS_KEY, []);
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
  const states = [...new Set(tableData.map((x) => x.state))];
  const workItemStreams = [...new Set(tableData.map((x) => x.workItemsSourceName))];
  const componentTags = [...new Set(tableData.flatMap((x) => parseTags(x.tags).component))];
  const customTypeTags = [...new Set(tableData.flatMap((x) => parseTags(x.tags).custom_type))];
  const tags = [...new Set(tableData.flatMap((x) => parseTags(x.tags).tags))];
  const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];
  const workTrackingIntegrationType = tableData[0]?.["workTrackingIntegrationType"];

  const categories = getHistogramCategories(colWidthBoundaries, "days");
  const allPairsData = allPairs(colWidthBoundaries);
  const epicNames = [...new Set(tableData.filter((x) => Boolean(x.epicName)).map((x) => x.epicName))];

  const dataSource = React.useMemo(() => getTransformedData(tableData, intl), [tableData, intl]);
  const columns = useWorkItemsDetailTableColumns({
    stateType,
    filters: {workItemTypes, stateTypes, states, teams, epicNames, categories, allPairsData, workItemStreams, componentTags, customTypeTags, tags},
    callBacks: {setShowPanel, setWorkItemKey},
    intl,
    selectedFilter,
    selectedMetric,
    supportsFilterOnCard,
    workTrackingIntegrationType,
    hidden_cols
  });

  const _defaultColDef = useDefaultColDef();
  const defaultColDef = React.useMemo(() => ({
    ..._defaultColDef,
    cellClass: "tw-flex tw-items-center tw-p-1 tw-pl-3",
    floatingFilter: true,
    floatingFilterComponent: CustomFloatingFilter,
    floatingFilterComponentParams: {
      suppressFilterButton: true,
    },
  }), []);

  const statusBar = React.useMemo(() => {
    return {
      statusPanels: [
        {
          statusPanel: CustomTotalAndFilteredRowCount,
          statusPanelParams: {
            label: "Work Items",
          },
          align: "left",
        },
        {
          statusPanel: "agAggregationComponent",
          statusPanelParams: {
            aggFuncs: ["avg", "min", "max"],
          },
        },
      ],
    };
  }, []);

  return (
    <>
    <AgGridStripeTable
      columnDefs={columns}
      rowData={dataSource}
      statusBar={statusBar}
      onSortChanged={getOnSortChanged([
        "cycleTimeOrLatency",
        "leadTimeOrAge",
        "effort",
        "duration",
        "latency",
        "delivery",
      ])}
      enableRangeSelection={true}
      defaultExcelExportParams={{
        fileName: "Work_In_Progress",
        autoConvertFormulas: true,
        processCellCallback: (params) => {
          const field = params.column.getColDef().field;
          return field === "url"
            ? `=HYPERLINK("${params.value}")`
            : params.formatValue
            ? params.formatValue(params.value)
            : params.value;
        },
      }}
      excelStyles={[
        {
          id: "hyperlinks",
          font: {
            underline: "Single",
            color: "#358ccb",
          },
        },
      ]}
      onCellClicked={(e) => {
        if (["quadrant", "name", "state", "latestCommitDisplay"].includes(e.colDef.field)) {
          const record = e.data;
          setShowPanel(true);
          setWorkItemKey(record.workItemKey || record.key);
        }
      }}
      testId="work-items-detail-table"
      onGridReady={onGridReady}
      defaultColDef={defaultColDef}
      onColumnVisible={getHandleColumnVisible(hidden_cols, setHiddenCols)}
    />
      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </>
    
  );
};
