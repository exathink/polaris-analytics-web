import React from "react";
import {useIntl} from "react-intl";
import {WorkItemStateTypeDisplayName} from "../../config";
import {joinTeams} from "../../helpers/teamUtils";
import {
  AgGridStripeTable,
  getOnSortChanged,
  SORTER,
  TextWithStyle,
  TextWithUom,
  useDefaultColDef,
} from "../../../../components/tables/tableUtils";
import {getNumber, useBlurClass} from "../../../../helpers/utility";
import {CardCol, StateTypeCol} from "../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories, isClosed} from "../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../i18n";
import {
  getMetricsMetaKey,
  getSelectedMetricDisplayName,
  projectDeliveryCycleFlowMetricsMeta,
} from "../../helpers/metricsMeta";

import {CustomFloatingFilter, CustomTotalAndFilteredRowCount, MultiCheckboxFilter} from "./wip/cycleTimeLatency/agGridUtils";

function getLeadTimeOrAge(item, intl) {
  return isClosed(item.stateType) ? getNumber(item.leadTime, intl) : getNumber(item.cycleTime, intl);
}

function getCycleTimeOrLatency(item, intl) {
  return isClosed(item.stateType) ? getNumber(item.cycleTime, intl) : getNumber(item.latency, intl);
}

function getTransformedData(data, intl) {
  const now = new Date().getTime();

  return data.map((item, index) => {
    return {
      ...item,
      leadTimeOrAge: getLeadTimeOrAge(item, intl),
      cycleTimeOrLatency: getCycleTimeOrLatency(item, intl),
      latency: getNumber(item.latency, intl),
      delivery: getNumber(item.latency, intl),
      commitLatency: getNumber(item.commitLatency, intl),
      effort: getNumber(item.effort, intl),
      duration: getNumber(item.duration, intl),
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
  callBacks,
  intl,
  selectedFilter,
  selectedMetric,
  supportsFilterOnCard,
}) {
  const blurClass = useBlurClass("tw-blur-[2px]");

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const MenuTabs = ["filterMenuTab", "generalMenuTab"];

  const effortCategories = filters.categories.map((b) => ({text: String(b).replace("day", "FTE Day"), value: String(b).replace("day", "FTE Day")}));
  let defaultOptionalCol = {
    headerName: projectDeliveryCycleFlowMetricsMeta["effort"].display,
    field: "effort",
    cellRenderer: React.memo(TextWithUom),
    cellRendererParams: {
      uom: "FTE Days",
    },
    filter: MultiCheckboxFilter,
    filterParams: {
      values: effortCategories,
      onFilter: ({value, record}) => {
        const [part1, part2] = filters.allPairsData[effortCategories.map((x) => x.value).indexOf(value)];
        return Number(record["effort"]) >= part1 && Number(record["effort"]) < part2;
      }
    },
    menuTabs: MenuTabs,
    comparator: SORTER.number_compare,
  };
  if (selectedMetric === "duration") {
    defaultOptionalCol = {
      headerName: projectDeliveryCycleFlowMetricsMeta["duration"].display,
      field: "duration",
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => testMetric(value, record, "duration"),
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
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          return testMetric(value, record, latencyKey);
        },
      },
      menuTabs: MenuTabs,
      comparator: SORTER.number_compare,
    };
  }

  let lastCol = {};
  if (isClosed(stateType)) {
    lastCol = {
      headerName: "Closed At",
      field: "endDate",
      cellRenderer: React.memo(TextWithStyle),
      comparator: (valA, valB, a, b) => SORTER.date_compare(a.endDate, b.endDate),
    };
  } else {
    lastCol = {
      headerName: "Latest Commit",
      field: "latestCommitDisplay",
      cellRenderer: React.memo(TextWithStyle),
      comparator: (valA, valB, a, b) => SORTER.date_compare(a.latestCommit, b.latestCommit),
    };
  }

  const columns = [
    {field: "displayId", headerName: "ID", hide: true},
    {field: "epicName", headerName: "Epic", hide: true},
    {
      headerName: "Workstream",
      field: "workItemsSourceName",
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.workItemStreams.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => record.workItemsSourceName === value,
      },
      menuTabs: MenuTabs,
      cellRenderer: React.memo(TextWithStyle),
      hide: true
    },
    {field: 'teams', headerName: 'Teams', hide: "true"},
    {field: 'url', headerName: 'URL', hide: "true", cellClass: 'hyperlinks'},
    {
      headerName: "Work Item",
      field: "name",
      width: 320,
      filter: "agTextColumnFilter",
      floatingFilter: false,
      filterParams: {
        filterOptions: ["contains", "startsWith"],
        buttons: ["reset"],
        maxNumConditions: 1,
      },
      filterValueGetter: (params) => {
        return `${params.getValue("name")} ${params.getValue("displayId")} ${params.getValue("epicName")}`;
      },
      pinned: "left",
      cellRenderer: React.memo(CardCol),
      autoHeight: true,
      comparator: (valA, valB, a, b) => SORTER.string_compare(a.data.workItemType, b.data.workItemType),
      menuTabs: [...MenuTabs, 'columnsMenuTab'],
    },
    {
      headerName: "State",
      field: "state",
      autoHeight: true,
      width: 250,
      cellRenderer: React.memo(StateTypeCol),
      comparator: (valA, valB, a, b) => SORTER.date_compare(a.data.latestTransitionDate, b.data.latestTransitionDate),
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.states.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => record.state.indexOf(value) === 0,
      },
      menuTabs: MenuTabs,
    },
    {
      headerName: getSelectedMetricDisplayName("leadTimeOrAge", stateType),
      field: "leadTimeOrAge",
      cellRenderer: React.memo(TextWithUom),
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          return testMetric(value, record, "leadTimeOrAge");
        },
      },
      menuTabs: MenuTabs,
      comparator: SORTER.number_compare,
    },
    {
      headerName: getSelectedMetricDisplayName("cycleTimeOrLatency", stateType),
      field: "cycleTimeOrLatency",
      cellRenderer: React.memo(TextWithUom),
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => {
          return testMetric(value, record, "cycleTimeOrLatency");
        },
      },
      menuTabs: MenuTabs,
      comparator: SORTER.number_compare,
    },
    defaultOptionalCol,
    lastCol,
  ];

  return columns;
}

export const WorkItemsDetailTable = ({
  view,
  stateType,
  tableData,
  setShowPanel,
  setWorkItemKey,
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

  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
  const states = [...new Set(tableData.map((x) => x.state))];
  const workItemStreams = [...new Set(tableData.map((x) => x.workItemsSourceName))];
  const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

  const categories = getHistogramCategories(colWidthBoundaries, "days");
  const allPairsData = allPairs(colWidthBoundaries);
  const epicNames = [...new Set(tableData.filter((x) => Boolean(x.epicName)).map((x) => x.epicName))];

  const dataSource = React.useMemo(() => getTransformedData(tableData, intl), [tableData, intl]);
  const columns = useWorkItemsDetailTableColumns({
    stateType,
    filters: {workItemTypes, stateTypes, states, teams, epicNames, categories, allPairsData, workItemStreams},
    callBacks: {setShowPanel, setWorkItemKey},
    intl,
    selectedFilter,
    selectedMetric,
    supportsFilterOnCard,
  });

  const _defaultColDef = useDefaultColDef();
  const defaultColDef = React.useMemo(() => ({
    ..._defaultColDef,
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
    <AgGridStripeTable
      columnDefs={columns}
      rowData={dataSource}
      statusBar={statusBar}
      onSortChanged={getOnSortChanged(["cycleTimeOrLatency", "leadTimeOrAge", "effort", "duration", "latency", "delivery"])}
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
    />
  );
};
