import {Link} from "react-router-dom";
import WorkItems from "../../../../work_items/context";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearch} from "../../../../../components/tables/hooks";
import {url_for_instance} from "../../../../../framework/navigation/context/helpers";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";
import {injectIntl} from "react-intl";
import {StripeTable} from "../../../../../components/tables/tableUtils";
import {formatDateTime} from "../../../../../i18n";
import {SORTER} from "../../helper/utils";
import {toMoment} from "../../../../../helpers/utility";

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

export function useFlowMetricsDetailTableColumns(workItemTypes, {setShowPanel, setWorkItemKey}) {
  const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearch("name", {customRender: customTitleRender(setShowPanel, setWorkItemKey)});
  const renderState = {render: customColRender(setShowPanel, setWorkItemKey)}
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
      filters: workItemTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
      width: "5%",
      ...renderState
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => SORTER.string_compare(a.state, b.state),
      width: "5%",
      ...renderState
    },
    {
      title: "Lead Time",
      dataIndex: "leadTime",
      key: "leadTime",
      width: "5%",
      sorter: (a, b) => a.leadTime - b.leadTime,
      ...renderState
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      width: "5%",
      sorter: (a, b) => a.cycleTime - b.cycleTime,
      ...renderState
    },
    {
      title: "Delivery Latency",
      dataIndex: "latency",
      key: "latency",
      width: "5%",
      sorter: (a, b) => a.latency - b.latency,
      ...renderState
    },
    {
      title: "Effort",
      dataIndex: "effort",
      key: "effort",
      width: "5%",
      sorter: (a, b) => a.effort - b.effort,
      ...renderState
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: "5%",
      sorter: (a, b) => a.duration - b.duration,
      ...renderState
    },
    {
      title: "Authors",
      dataIndex: "authorCount",
      key: "authorCount",
      width: "5%",
      sorter: (a, b) => a.authorCount - b.authorCount,
      ...renderState
    },
    {
      title: "Backlog Time",
      dataIndex: "backlogTime",
      key: "backlogTime",
      width: "5%",
      sorter: (a, b) => a.backlogTime - b.backlogTime,
      ...renderState
    },
    {
      title: "Closed At",
      dataIndex: "endDate",
      key: "endDate",
      width: "5%",
      sorter: (a, b) => SORTER.date_compare(a.endDate, b.endDate),
      ...renderState
    },
  ];

  return columns;
}


export const FlowMetricsDetailTable = injectIntl(({tableData, intl, setShowPanel, setWorkItemKey}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];

  const columns = useFlowMetricsDetailTableColumns(workItemTypes, {setShowPanel, setWorkItemKey});
  const dataSource = getTransformedData(tableData, intl);

  return (
    <StripeTable columns={columns} dataSource={dataSource} testId="flowmetrics-detail-table"/>
  );
});
