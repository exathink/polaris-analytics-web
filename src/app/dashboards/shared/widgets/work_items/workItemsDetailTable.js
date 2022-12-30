import React from "react";
import {useSearchMultiCol} from "../../../../components/tables/hooks";
import {useIntl} from "react-intl";
import {AppTerms, WorkItemStateTypeDisplayName} from "../../config";
import {joinTeams} from "../../helpers/teamUtils";
import {getRecordsCount, SORTER, StripeTable} from "../../../../components/tables/tableUtils";
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
  }
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
    title: projectDeliveryCycleFlowMetricsMeta["effort"].display,
    dataIndex: "effort",
    key: "effort",
    ...(selectedMetric === "effort" ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null} : {}),
    filters: filters.categories.map((b) => ({text: b, value: b})),
    onFilter: (value, record) => testMetric(value, record, "effort"),
    width: "5%",
    sorter: (a, b) => SORTER.number_compare(a.effort, b.effort),
    ...effortRenderState,
  };
  if (selectedMetric === "duration") {
    defaultOptionalCol = {
      title: projectDeliveryCycleFlowMetricsMeta["duration"].display,
      dataIndex: "duration",
      key: "duration",
      ...(selectedMetric === "duration" ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null} : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "duration"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.duration, b.duration),
      ...metricRenderState,
    };
  }
  const latencyKey = getMetricsMetaKey("latency", stateType);
  if (selectedMetric === latencyKey) {
    defaultOptionalCol = {
      title: getSelectedMetricDisplayName("latency", stateType),
      dataIndex: latencyKey,
      key: latencyKey,
      ...(selectedMetric === latencyKey ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null} : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, latencyKey),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a[latencyKey], b[latencyKey]),
      ...metricRenderState,
    };
  }

  let lastCol = {};
  if (isClosed(stateType)) {
    lastCol = {
      title: "Closed At",
      dataIndex: "endDate",
      key: "endDate",
      width: "6%",
      sorter: (a, b) => SORTER.date_compare(a.endDate, b.endDate),
      ...renderState,
    };
  } else {
    lastCol = {
      title: "Latest Commit",
      dataIndex: "latestCommitDisplay",
      key: "latestCommit",
      width: "6%",
      sorter: (a, b) => SORTER.date_compare(a.latestCommit, b.latestCommit),
      ...renderState,
    };
  }

  const columns = [
    {
      title: "Workstream",
      dataIndex: "workItemsSourceName",
      key: "workItemsSourceName",
      filters: filters.workItemStreams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemsSourceName.indexOf(value) === 0,
      width: "6%",
      render: (text, record) => text 
    },
    {
      title: "CARD",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...(supportsFilterOnCard ? filterState : titleSearchState),
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "7%",
      sorter: (a, b) => SORTER.date_compare(a.latestTransitionDate, b.latestTransitionDate),
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
      title: getSelectedMetricDisplayName("leadTimeOrAge", stateType),
      dataIndex: "leadTimeOrAge",
      key: "leadTime",
      ...(selectedMetric === "leadTimeOrAge"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "leadTimeOrAge"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.leadTimeOrAge, b.leadTimeOrAge),
      ...metricRenderState,
    },
    {
      title: getSelectedMetricDisplayName("cycleTimeOrLatency", stateType),
      dataIndex: "cycleTimeOrLatency",
      key: "cycleTime",
      ...(selectedMetric === "cycleTimeOrLatency"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : null}
        : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "cycleTimeOrLatency"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.cycleTimeOrLatency, b.cycleTimeOrLatency),
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

    return (
      <StripeTable
        columns={columns}
        dataSource={dataSource}
        testId="work-items-detail-table"
        rowKey={(record) => record.rowKey}
        onChange={handleChange}
        loading={loading}
        paginationOptions={paginationOptions}
        renderTableSummary={(pageData) => {
          const avgData = getAvgSortersData(pageData);
          const avgFiltersData = getAvgFiltersData(pageData);
          
          return (
            <>
              <LabelValue label={specsOnly ? AppTerms.specs.display : AppTerms.cards.display} value={getRecordsCount(pageData, paginationOptions)} />
              {avgFiltersData
                .filter((x) => summaryStatsColumns[x.appliedFilter])
                .map((x, i) => {
                  return (
                    <LabelValue
                      key={x.appliedFilter}
                      label={`Avg. ${getSelectedMetricDisplayName(x.appliedFilter, stateType)}`}
                      value={i18nNumber(intl, x.average, 2)}
                      uom={summaryStatsColumns[x.appliedFilter]}
                    />
                  );
                })}
              {avgData !== 0 &&
                avgData && appliedFilters.includes(getMetricsMetaKey(appliedSorter, stateType))===false && (
                  <LabelValue
                    key={getMetricsMetaKey(appliedSorter, stateType)}
                    label={`Avg. ${appliedName}`}
                    value={i18nNumber(intl, avgData, 2)}
                    uom={summaryStatsColumns[appliedSorter]}
                  />
                )}
            </>
          );
        }}
      />
    );
  };
