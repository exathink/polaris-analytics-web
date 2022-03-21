import React from "react";
import {useSearchMultiCol} from "../../../../components/tables/hooks";
import {injectIntl} from "react-intl";
import {WorkItemStateTypeDisplayName, WorkItemStateTypes} from "../../config";
import {joinTeams} from "../../helpers/teamUtils";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";
import {getNumber, toMoment} from "../../../../helpers/utility";
import {
  comboColumnStateTypeRender,
  comboColumnTitleRender,
  customColumnRender,
} from "../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories} from "../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../i18n";
import {projectDeliveryCycleFlowMetricsMeta} from "../../helpers/metricsMeta";

function isClosed(item) {
  return item.stateType === WorkItemStateTypes.closed;
}

function getLeadTimeOrAge(item, intl) {
  return isClosed(item) ? getNumber(item.leadTime, intl) : getNumber(item.cycleTime, intl);
}

function getCycleTimeOrLatency(item, intl) {
  return isClosed(item) ? getNumber(item.cycleTime, intl) : getNumber(item.latency, intl);
}

function getTransformedData(data, intl) {
  const now = new Date().getTime();

  return data.map((item, index) => {
    return {
      ...item,
      leadTimeOrAge: getLeadTimeOrAge(item, intl),
      cycleTimeOrLatency: getCycleTimeOrLatency(item, intl),
      latency: getNumber(item.latency, intl),
      commitLatency: getNumber(item.commitLatency, intl),
      effort: getNumber(item.effort, intl),
      duration: getNumber(item.duration, intl),
      stateType: WorkItemStateTypeDisplayName[item.stateType],
      stateTypeInternal: item.stateType,
      latestTransitionDate: item.workItemStateDetails.currentStateTransition.eventDate,
      teams: joinTeams(item),
      endDate: formatDateTime(intl, toMoment(item.endDate)),
      rowKey: `${now}.${index}`,
    };
  });
}

function customTeamsColRender({setShowPanel, setWorkItemKey}) {
  return (text, record, searchText) => {
    return (
      text && (
        <span
          onClick={() => {
            setShowPanel(true);
            setWorkItemKey(record.key ?? record.workItemKey);
          }}
          className="tw-cursor-pointer tw-font-medium"
        >
          {record.teamNodeRefs.length > 1 ? "Multiple" : text}
        </span>
      )
    );
  };
}

export function useWorkItemsDetailTableColumns({stateType, filters, callBacks, intl, selectedFilter, selectedMetric}) {
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {
    customRender: comboColumnTitleRender(callBacks.setShowPanel, callBacks.setWorkItemKey),
  });
  const stateTypeRenderState = {render: comboColumnStateTypeRender(callBacks.setShowPanel, callBacks.setWorkItemKey)};
  const metricRenderState = {
    render: customColumnRender({...callBacks, colRender: (text) => <>{text} days</>, className: "tw-textXs"}),
  };
  const effortRenderState = {
    render: customColumnRender({...callBacks, colRender: (text) => <>{text} dev-days</>, className: "tw-textXs"}),
  };
  const renderState = {render: customColumnRender({...callBacks, className: "tw-textXs"})};
  const renderTeamsCol = {render: customTeamsColRender(callBacks)};

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  let defaultOptionalCol = {
    title: projectDeliveryCycleFlowMetricsMeta["effort"].display,
    dataIndex: "effort",
    key: "effort",
    ...(selectedMetric === "effort" ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []} : {}),
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
      ...(selectedMetric === "duration" ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []} : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "duration"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.duration, b.duration),
      ...metricRenderState,
    };
  }
  if (selectedMetric === "latency") {
    defaultOptionalCol = {
      title: projectDeliveryCycleFlowMetricsMeta["latency"].display,
      dataIndex: "latency",
      key: "latency",
      ...(selectedMetric === "latency" ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []} : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "latency"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.latency, b.latency),
      ...metricRenderState,
    };
  }

  let lastCol = {};
  if (isClosed({stateType})) {
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
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.workItemStateDetails.latestCommit, b.workItemStateDetails.latestCommit),
      ...renderState,
    };
  }

  const columns = [
    {
      title: "Team",
      dataIndex: "teams",
      key: "teams",
      filters: filters.teams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.teams.match(new RegExp(value, "i")),
      width: "4%",
      ...renderTeamsCol,
    },
    {
      title: "CARD",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...titleSearchState,
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
      title: isClosed({stateType}) ? projectDeliveryCycleFlowMetricsMeta["leadTime"].display : `${projectDeliveryCycleFlowMetricsMeta["age"].display}      `,
      dataIndex: "leadTimeOrAge",
      key: "leadTime",
      ...(selectedMetric === "leadTimeOrAge"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []}
        : {}),
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "leadTimeOrAge"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.leadTimeOrAge, b.leadTimeOrAge),
      ...metricRenderState,
    },
    {
      title: isClosed({stateType}) ? projectDeliveryCycleFlowMetricsMeta["cycleTime"].display : `${projectDeliveryCycleFlowMetricsMeta["latency"].display}       `,
      dataIndex: "cycleTimeOrLatency",
      key: "cycleTime",
      ...(selectedMetric === "cycleTimeOrLatency"
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []}
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

export const WorkItemsDetailTable = injectIntl(
  ({
    view,
    stateType,
    tableData,
    intl,
    setShowPanel,
    setWorkItemKey,
    colWidthBoundaries,
    selectedFilter,
    selectedMetric,
    onChange
  }) => {
    // get unique workItem types
    const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
    const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
    const states = [...new Set(tableData.map((x) => x.state))];
    const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

    const categories = getHistogramCategories(colWidthBoundaries, selectedMetric === "effort" ? "dev-days" : "days");
    const allPairsData = allPairs(colWidthBoundaries);
    const epicNames = [...new Set(tableData.filter(x => Boolean(x.epicName)).map((x) => x.epicName))];

    const dataSource = getTransformedData(tableData, intl);
    const columns = useWorkItemsDetailTableColumns({
      stateType,
      filters: {workItemTypes, stateTypes, states, teams, epicNames, categories, allPairsData},
      callBacks: {setShowPanel, setWorkItemKey},
      intl,
      selectedFilter,
      selectedMetric,
    });

    return (
      <StripeTable
        columns={columns}
        dataSource={dataSource}
        testId="work-items-detail-table"
        height={view === "primary" ? TABLE_HEIGHTS.FORTY_FIVE : TABLE_HEIGHTS.NINETY}
        rowKey={(record) => record.rowKey}
        onChange={onChange}
      />
    );
  }
);
