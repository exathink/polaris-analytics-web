import React from "react";
import {useSearchMultiCol} from "../../../../components/tables/hooks";
import {useIntl} from "react-intl";
import {AppTerms, WorkItemStateTypeDisplayName} from "../../config";
import {joinTeams} from "../../helpers/teamUtils";
import {
  AgGridStripeTable,
  getOnSortChanged,
  getRecordsCount,
  SORTER,
  StripeTable,
  TextWithStyle,
  TextWithUom,
  VirtualStripeTable,
} from "../../../../components/tables/tableUtils";
import {getNumber, i18nNumber, useBlurClass} from "../../../../helpers/utility";
import {
  CardCol,
  StateTypeCol,
  comboColumnStateTypeRender,
  comboColumnTitleRender,
  customColumnRender,
} from "../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories, isClosed} from "../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../i18n";
import {
  getMetricsMetaKey,
  getSelectedMetricDisplayName,
  projectDeliveryCycleFlowMetricsMeta,
} from "../../helpers/metricsMeta";
import {LabelValue} from "../../../../helpers/components";
import {useSummaryStats} from "../../hooks/useSummaryStats";
import {CustomTotalAndFilteredRowCount, MultiCheckboxFilter} from "./wip/cycleTimeLatency/agGridUtils";

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
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {
    customRender: comboColumnTitleRender({...callBacks, blurClass: blurClass}),
  });

  const filterState = {
    filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
    ...(selectedMetric === undefined ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null} : {}),
    onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
    render: comboColumnTitleRender({...callBacks, search: false, blurClass: blurClass}),
  };

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const MenuTabs = ["filterMenuTab", "generalMenuTab"];

  let defaultOptionalCol = {
    headerName: projectDeliveryCycleFlowMetricsMeta["effort"].display,
    field: "effort",
    cellRenderer: TextWithUom,
    cellRendererParams: {
      uom: "FTE Days",
    },
    ...(selectedMetric === "effort" ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null} : {}),

    filter: MultiCheckboxFilter,
    filterParams: {
      values: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: ({value, record}) => testMetric(value, record, "effort"),
    },
    menuTabs: MenuTabs,
    comparator: SORTER.number_compare,
  };
  if (selectedMetric === "duration") {
    defaultOptionalCol = {
      headerName: projectDeliveryCycleFlowMetricsMeta["duration"].display,
      field: "duration",
      ...(selectedMetric === "duration"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),

      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.categories.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => testMetric(value, record, "duration"),
      },
      menuTabs: MenuTabs,
      cellRenderer: TextWithUom,
      comparator: SORTER.number_compare,
    };
  }
  const latencyKey = getMetricsMetaKey("latency", stateType);
  if (selectedMetric === latencyKey) {
    defaultOptionalCol = {
      headerName: getSelectedMetricDisplayName("latency", stateType),
      field: latencyKey,
      cellRenderer: TextWithUom,
      ...(selectedMetric === latencyKey
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
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
      cellRenderer: TextWithStyle,
      comparator: (valA, valB, a, b) => SORTER.date_compare(a.endDate, b.endDate),
    };
  } else {
    lastCol = {
      headerName: "Latest Commit",
      field: "latestCommitDisplay",
      cellRenderer: TextWithStyle,
      comparator: (valA, valB, a, b) => SORTER.date_compare(a.latestCommit, b.latestCommit),
    };
  }

  const columns = [
    {
      headerName: "Work Item",
      field: "name",
      width: 320,
      pinned: "left",
      cellRenderer: React.memo(CardCol),
      autoHeight: true,
      comparator: (valA, valB, a, b) => SORTER.string_compare(a.data.workItemType, b.data.workItemType),
      ...(supportsFilterOnCard ? filterState : titleSearchState),
    },
    {
      headerName: "State",
      field: "state",
      autoHeight: true,
      cellRenderer: StateTypeCol,
      comparator: (valA, valB, a, b) => SORTER.date_compare(a.data.latestTransitionDate, b.data.latestTransitionDate),
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.states.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => record.state.indexOf(value) === 0,
      },
      menuTabs: MenuTabs,
    },
    {
      headerName: "Workstream",
      field: "workItemsSourceName",
      width: 250,
      filter: MultiCheckboxFilter,
      filterParams: {
        values: filters.workItemStreams.map((b) => ({text: b, value: b})),
        onFilter: ({value, record}) => record.workItemsSourceName === value,
      },
      menuTabs: MenuTabs,
      cellRenderer: TextWithStyle,
    },
    {
      headerName: getSelectedMetricDisplayName("leadTimeOrAge", stateType),
      field: "leadTimeOrAge",
      cellRenderer: TextWithUom,
      ...(selectedMetric === "leadTimeOrAge"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
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
      cellRenderer: TextWithUom,
      ...(selectedMetric === "cycleTimeOrLatency"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
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

const summaryStatsColumns = {
  cycleTimeOrLatency: "Days",
  cycleTime: "Days",
  latency: "Days",
  leadTimeOrAge: "Days",
  age: "Days",
  leadTime: "Days",
  effort: "FTE Days",
  delivery: "Days",
  duration: "Days",
};

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
}) => {
  const intl = useIntl();

  const {appliedFilters, appliedSorter, appliedName, handleChange, getAvgFiltersData, getAvgSortersData} =
    useSummaryStats({summaryStatsColumns, extraFilter: getMetricsMetaKey(selectedMetric, stateType)});

  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
  const states = [...new Set(tableData.map((x) => x.state))];
  const workItemStreams = [...new Set(tableData.map((x) => x.workItemsSourceName))];
  const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

  const categories = getHistogramCategories(colWidthBoundaries, selectedMetric === "effort" ? "FTE Days" : "days");
  const allPairsData = allPairs(colWidthBoundaries);
  const epicNames = [...new Set(tableData.filter((x) => Boolean(x.epicName)).map((x) => x.epicName))];

  const dataSource = getTransformedData(tableData, intl);
  const columns = useWorkItemsDetailTableColumns({
    stateType,
    filters: {workItemTypes, stateTypes, states, teams, epicNames, categories, allPairsData, workItemStreams},
    callBacks: {setShowPanel, setWorkItemKey},
    intl,
    selectedFilter,
    selectedMetric,
    supportsFilterOnCard,
  });

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

  const gridRef = React.useRef(null);

  return (
    <AgGridStripeTable
      ref={gridRef}
      columnDefs={columns}
      rowData={dataSource}
      statusBar={statusBar}
      onSortChanged={getOnSortChanged(["cycleTimeOrLatency", "leadTimeOrAge", "effort"])}
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
          setWorkItemKey(record.key);
        }
      }}
      testId="work-items-detail-table"
    />
  );
};
