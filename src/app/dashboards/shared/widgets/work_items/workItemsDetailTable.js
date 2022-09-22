import React from "react";
import {useSearchMultiCol} from "../../../../components/tables/hooks";
import {useIntl} from "react-intl";
import {WorkItemStateTypeDisplayName} from "../../config";
import {joinTeams} from "../../helpers/teamUtils";
import {SORTER, StripeTable, TABLE_HEIGHTS} from "../../../../components/tables/tableUtils";
import {average, getNumber, i18nNumber, useBlurClass} from "../../../../helpers/utility";
import {
  comboColumnStateTypeRender,
  comboColumnTitleRender,
  customColumnRender,
} from "../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories, isClosed} from "../../../projects/shared/helper/utils";
import {formatDateTime} from "../../../../i18n";
import {getMetricsMetaKey, getSelectedMetricDisplayName, projectDeliveryCycleFlowMetricsMeta} from "../../helpers/metricsMeta";
import { Table } from "antd";
import Text from "antd/lib/typography/Text";

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

export function useWorkItemsDetailTableColumns({stateType, filters, callBacks, intl, selectedFilter, selectedMetric, supportsFilterOnCard}) {
  const blurClass = useBlurClass("tw-blur-[2px]");
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {
    customRender: comboColumnTitleRender({...callBacks, blurClass: blurClass}),
  });

  const filterState = {
      filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
      ...(selectedMetric === undefined ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []} : {}),
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
  const latencyKey = getMetricsMetaKey("latency", stateType);
  if (selectedMetric === latencyKey) {
    defaultOptionalCol = {
      title: getSelectedMetricDisplayName("latency", stateType),
      dataIndex: latencyKey,
      key: latencyKey,
      ...(selectedMetric === latencyKey ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []} : {}),
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
        ? {defaultFilteredValue: selectedFilter != null ? [selectedFilter] : []}
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
    loading
  }) => {
    const intl = useIntl();

    const [appliedSorter, setAppliedSorter] = React.useState();
    const [appliedName, setAppliedName] = React.useState();

    // get unique workItem types
    const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
    const stateTypes = [...new Set(tableData.map((x) => WorkItemStateTypeDisplayName[x.stateType]))];
    const states = [...new Set(tableData.map((x) => x.state))];
    const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];

    const categories = getHistogramCategories(colWidthBoundaries, selectedMetric === "effort" ? "FTE Days" : "days");
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
      supportsFilterOnCard
    });

    function handleChange(p, f, s, e) {
      setAppliedSorter(s?.column?.dataIndex)
      setAppliedName(s?.column?.title)
      onChange?.(p,f,s,e);
    }

    return (
      <StripeTable
        columns={columns}
        dataSource={dataSource}
        testId="work-items-detail-table"
        height={view === "primary" ? TABLE_HEIGHTS.THIRTY : TABLE_HEIGHTS.SEVENTY}
        rowKey={(record) => record.rowKey}
        onChange={handleChange}
        loading={loading}
        summary={(pageData) => {
        
        const avgData = appliedSorter && ["cycleTimeOrLatency", "leadTimeOrAge", "effort"].includes(appliedSorter) ? average(pageData, (item) => +(item[appliedSorter])) : undefined;

        return (
          <Table.Summary fixed="bottom">
            <Table.Summary.Row className="tw-bg-gray-100">
              <Table.Summary.Cell index={0} align="left" className="tw-font-medium tw-uppercase">
                Records
                <Text strong className="tw-ml-4">
                  {pageData?.length}
                </Text>
              </Table.Summary.Cell>

              {avgData && <Table.Summary.Cell index={1} align="left" className="tw-font-medium tw-uppercase">
                Avg. {appliedName}
                <Text strong className="tw-ml-4">
                  {i18nNumber(intl, avgData, 2)}
                </Text>
              </Table.Summary.Cell>}

              <Table.Summary.Cell index={2} colSpan="6" align="left"></Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
      />
    );
  };
