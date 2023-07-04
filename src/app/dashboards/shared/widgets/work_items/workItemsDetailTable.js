import React from "react";
import {useSearchMultiCol} from "../../../../components/tables/hooks";
import {useIntl} from "react-intl";
import {AppTerms, WorkItemStateTypeDisplayName} from "../../config";
import {joinTeams} from "../../helpers/teamUtils";
import {AgGridStripeTable, getOnSortChanged, getRecordsCount, SORTER, StripeTable, TextWithUom, VirtualStripeTable} from "../../../../components/tables/tableUtils";
import {getNumber, i18nNumber, useBlurClass} from "../../../../helpers/utility";
import {
  comboColumnStateTypeRender,
  comboColumnTitleRender,
  customColumnRender,
} from "../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories, isClosed} from "../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../i18n";
import {getMetricsMetaKey, getSelectedMetricDisplayName, projectDeliveryCycleFlowMetricsMeta} from "../../helpers/metricsMeta";
import {LabelValue} from "../../../../helpers/components";
import {useSummaryStats} from "../../hooks/useSummaryStats";
import { CustomTotalAndFilteredRowCount, MultiCheckboxFilter } from "./wip/cycleTimeLatency/agGridUtils";

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

export function useWorkItemsDetailTableColumns({stateType, filters, callBacks, intl, selectedFilter, selectedMetric, supportsFilterOnCard}) {
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
  const stateTypeRenderState = {render: comboColumnStateTypeRender(callBacks.setShowPanel, callBacks.setWorkItemKey)};
  const metricRenderState = {
    render: customColumnRender({...callBacks, colRender: (text) => <>{text} days</>, className: "tw-textXs"}),
  };
  const effortRenderState = {
    render: customColumnRender({...callBacks, colRender: (text) => <>{text} FTE Days</>, className: "tw-textXs"}),
  };
  const renderState = {render: customColumnRender({...callBacks, className: "tw-textXs"})};

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  let defaultOptionalCol = {
    headerName: projectDeliveryCycleFlowMetricsMeta["effort"].display,
    field: "effort",
    cellRenderer: TextWithUom,
    cellRendererParams: {
      uom: "FTE Days",
    },
    ...(selectedMetric === "effort" ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null} : {}),
    filters: filters.categories.map((b) => ({text: b, value: b})),
    onFilter: (value, record) => testMetric(value, record, "effort"),

    sorter: (a, b) => SORTER.number_compare(a.effort, b.effort),
    ...effortRenderState,
  };
  if (selectedMetric === "duration") {
    defaultOptionalCol = {
      headerName: projectDeliveryCycleFlowMetricsMeta["duration"].display,
      field: "duration",
      ...(selectedMetric === "duration"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "duration"),

      sorter: (a, b) => SORTER.number_compare(a.duration, b.duration),
      ...metricRenderState,
    };
  }
  const latencyKey = getMetricsMetaKey("latency", stateType);
  if (selectedMetric === latencyKey) {
    defaultOptionalCol = {
      headerName: getSelectedMetricDisplayName("latency", stateType),
      field: latencyKey,
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

      comparator: (valA, valB, nodeA, nodeB) => SORTER.number_compare(nodeA[latencyKey], nodeB[latencyKey]),
      ...metricRenderState,
    };
  }

  let lastCol = {};
  if (isClosed(stateType)) {
    lastCol = {
      headerName: "Closed At",
      field: "endDate",

      comparator: (valA, valB, a, b) => SORTER.date_compare(a.endDate, b.endDate),
      ...renderState,
    };
  } else {
    lastCol = {
      headerName: "Latest Commit",
      field: "latestCommitDisplay",

      comparator: (valA, valB, a, b) => SORTER.date_compare(a.latestCommit, b.latestCommit),
      ...renderState,
    };
  }

  const columns = [
    {
      headerName: "Workstream",
      field: "workItemsSourceName",
      filters: filters.workItemStreams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemsSourceName.indexOf(value) === 0,

      render: (text, record) => text,
    },
    {
      headerName: "CARD",
      field: "name",

      comparator: (valA, valB, a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...(supportsFilterOnCard ? filterState : titleSearchState),
    },
    {
      headerName: "State",
      field: "state",

      comparator: (valA, valB, a, b) => SORTER.date_compare(a.latestTransitionDate, b.latestTransitionDate),
      filters: filters.states.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.state.indexOf(value) === 0,
      ...stateTypeRenderState,
    },
    {
      // TODO: this little hack to pad the title is to work around
      // a jitter on the table that appears to be because the column titles have
      // different widths between the two renders. It does not fix it perfectly
      // but makes it less noticeable. There is a bigger underlying issue
      // here which is possible because we are returning these columns in a hook,
      // but I dont know for sure and did not have the time to investigate it well
      // enough. Something to look at.
      headerName: getSelectedMetricDisplayName("leadTimeOrAge", stateType),
      field: "leadTimeOrAge",
      cellRenderer: TextWithUom,
      ...(selectedMetric === "leadTimeOrAge"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "leadTimeOrAge"),

      comparator: SORTER.number_compare,
      ...metricRenderState,
    },
    {
      headerName: getSelectedMetricDisplayName("cycleTimeOrLatency", stateType),
      field: "cycleTimeOrLatency",
      cellRenderer: TextWithUom,
      ...(selectedMetric === "cycleTimeOrLatency"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "cycleTimeOrLatency"),

      comparator: SORTER.number_compare,
      ...metricRenderState,
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
  duration: "Days"
}

export const WorkItemsDetailTable = 
  ({
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
    paginationOptions
  }) => {
    const intl = useIntl();

    const {appliedFilters ,appliedSorter, appliedName, handleChange, getAvgFiltersData, getAvgSortersData} =
      useSummaryStats({summaryStatsColumns, extraFilter: getMetricsMetaKey(selectedMetric, stateType)});

    // get unique workItem types
    const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
    const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
    const states = [...new Set(tableData.map((x) => x.state))];
    const workItemStreams = [...new Set(tableData.map((x) => x.workItemsSourceName))];
    const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

    const categories = getHistogramCategories(colWidthBoundaries, selectedMetric === "effort" ? "FTE Days" : "days");
    const allPairsData = allPairs(colWidthBoundaries);
    const epicNames = [...new Set(tableData.filter(x => Boolean(x.epicName)).map((x) => x.epicName))];

    const dataSource = getTransformedData(tableData, intl);
    const columns = useWorkItemsDetailTableColumns({
      stateType,
      filters: {workItemTypes, stateTypes, states, teams, epicNames, categories, allPairsData, workItemStreams},
      callBacks: {setShowPanel, setWorkItemKey},
      intl,
      selectedFilter,
      selectedMetric,
      supportsFilterOnCard
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
