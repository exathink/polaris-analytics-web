import {Link} from "react-router-dom";
import WorkItems from "../../../../../work_items/context";
import {Highlighter} from "../../../../../../components/misc/highlighter";
import {useSearch} from "../../../../../../components/tables/hooks";
import {url_for_instance} from "../../../../../../framework/navigation/context/helpers";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../helpers/metricsMeta";
import {injectIntl} from "react-intl";
import {StripeTable, SORTER} from "../../../../../../components/tables/tableUtils";
import {formatDateTime} from "../../../../../../i18n";
import {toMoment} from "../../../../../../helpers/utility";
import {joinTeams} from "../../../../helpers/teamUtils";
import {allPairs, getCategories} from "../../../../../projects/shared/helper/utils";

const getNumber = (num, intl) => {
  return intl.formatNumber(num, {maximumFractionDigits: 2});
};

function getDate(date, intl) {
  return formatDateTime(intl, toMoment(date));
}

function getTransformedData(data, intl) {
  return data.map((item) => {
    return {
      ...item,
      leadTime: getNumber(item.leadTime, intl),
      cycleTime: getNumber(item.cycleTime, intl),
      deliveryLatency: getNumber(item.deliveryLatency, intl),
      duration: getNumber(item.duration, intl),
      effort: getNumber(item.effort, intl),
      authorCount: getNumber(item.authorCount, intl),
      latency: getNumber(item.latency, intl),
      backlogTime: getNumber(projectDeliveryCycleFlowMetricsMeta["backlogTime"].value(item), intl),
      endDate: getDate(item.endDate, intl),
      teams: joinTeams(item),
    };
  });
}

function customRender(text, record, searchText) {
  return (
    text && (
      <Link to={`${url_for_instance(WorkItems, record.displayId, record.workItemKey)}`}>
        <Highlighter
          highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
          searchWords={searchText || ""}
          textToHighlight={text.toString()}
        />
      </Link>
    )
  );
}

function customTitleRender(setShowPanel, setWorkItemKey) {
  return (text, record, searchText) => text && (
    <span
      onClick={() => {
        setShowPanel(true);
        setWorkItemKey(record.workItemKey);
      }}
      style={{cursor: "pointer"}}
    >
      <Highlighter
        highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
        searchWords={searchText || ""}
        textToHighlight={text.toString()}
      />
    </span>
  );
}

function customColRender(setShowPanel, setWorkItemKey) {
  return (text, record, searchText) => text && (
    <span
      onClick={() => {
        setShowPanel(true);
        setWorkItemKey(record.workItemKey);
      }}
      style={{cursor: "pointer"}}
    >
      {text}
    </span>
  );
}

function renderTeamsCol(setShowPanel, setWorkItemKey) {
  return (text, record, searchText) => {
    return (
      text && (
        <span
          onClick={() => {
            setShowPanel(true);
            setWorkItemKey(record.workItemKey);
          }}
          style={{cursor: "pointer"}}
        >
          {record.teamNodeRefs.length > 1 ? "Multiple" : text}
        </span>
      )
    );
  };
}

export function useFlowMetricsDetailTableColumns(filters, {setShowPanel, setWorkItemKey}) {
  const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearch("name", {customRender: customTitleRender(setShowPanel, setWorkItemKey)});
  const renderState = {render: customColRender(setShowPanel, setWorkItemKey)}
  const renderTeamsColState = {render: renderTeamsCol(setShowPanel, setWorkItemKey)}

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "displayId",
      key: "displayId",
      width: "5%",
      sorter: (a, b) => SORTER.string_compare(a.displayId, b.displayId),
      ...nameSearchState,
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => SORTER.string_compare(a.name, b.name),
      ...titleSearchState,
    },
    {
      title: "Type",
      dataIndex: "workItemType",
      key: "workItemType",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
      width: "5%",
      ...renderState,
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => SORTER.string_compare(a.state, b.state),
      width: "5%",
      ...renderState,
    },
    {
      title: "Team",
      dataIndex: "teams",
      key: "teams",
      filters: filters.teams.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.teams.match(new RegExp(value, "i")),
      width: "5%",
      ...renderTeamsColState,
    },
    {
      title: "Lead Time",
      dataIndex: "leadTime",
      key: "leadTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "leadTime"),
      width: "5%",
      sorter: (a, b) => a.leadTime - b.leadTime,
      ...renderState,
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "cycleTime"),
      width: "5%",
      sorter: (a, b) => a.cycleTime - b.cycleTime,
      ...renderState,
    },
    {
      title: "Implementation",
      dataIndex: "duration",
      key: "duration",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "duration"),
      width: "5%",
      sorter: (a, b) => a.duration - b.duration,
      ...renderState,
    },
    {
      title: "Effort",
      dataIndex: "effort",
      key: "effort",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "effort"),
      width: "5%",
      sorter: (a, b) => a.effort - b.effort,
      ...renderState,
    },
    {
      title: "Delivery",
      dataIndex: "latency",
      key: "latency",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "latency"),
      width: "5%",
      sorter: (a, b) => a.latency - b.latency,
      ...renderState,
    },
    {
      title: "Authors",
      dataIndex: "authorCount",
      key: "authorCount",
      width: "5%",
      sorter: (a, b) => a.authorCount - b.authorCount,
      ...renderState,
    },
    {
      title: "Backlog Time",
      dataIndex: "backlogTime",
      key: "backlogTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "backlogTime"),
      width: "5%",
      sorter: (a, b) => a.backlogTime - b.backlogTime,
      ...renderState,
    },
    {
      title: "Closed At",
      dataIndex: "endDate",
      key: "endDate",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.endDate, b.endDate),
      ...renderState,
    },
  ];

  return columns;
}


export const FlowMetricsDetailTable = injectIntl(({tableData, intl, setShowPanel, setWorkItemKey, colWidthBoundaries}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];
  const categories = getCategories(colWidthBoundaries);
  const allPairsData = allPairs(colWidthBoundaries);
  const columns = useFlowMetricsDetailTableColumns({workItemTypes, teams, categories, allPairsData}, {setShowPanel, setWorkItemKey});
  const dataSource = getTransformedData(tableData, intl);

  return (
    <StripeTable
      columns={columns}
      dataSource={dataSource}
      testId="flowmetrics-detail-table"
      rowKey={(record) => record.key}
    />
  );
});
