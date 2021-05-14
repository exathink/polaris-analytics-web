import {Table} from "antd";
import {Link} from "react-router-dom";
import WorkItems from "../../../../work_items/context";
import {Highlighter} from "../../../../../components/misc/highlighter";
import {useSearch} from "../../../../../components/tables/hooks";
import {url_for_instance} from "../../../../../framework/navigation/context/helpers";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";
import {injectIntl} from "react-intl";
import styles from "./flowMetrics.module.css";

const getNumber = (num, intl) => {
  return intl.formatNumber(num, {maximumFractionDigits: 2});
};

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
    };
  });
}

function customRender(text, record, searchText) {
  return (
    text && (
      <Link to={`${url_for_instance(WorkItems, record.name, record.workItemKey)}`}>
        <Highlighter
          highlightStyle={{backgroundColor: "#ffc069", padding: 0}}
          searchWords={searchText || ""}
          textToHighlight={text.toString()}
        />
      </Link>
    )
  );
}

const string_compare = (a, b, propName) => {
  const [stra, strb] = [a[propName], b[propName]];
  return stra.localeCompare(strb);
};

export function useFlowMetricsDetailTableColumns(workItemTypes) {
  const nameSearchState = useSearch("displayId", {customRender});
  const titleSearchState = useSearch("name");

  const columns = [
    {
      title: "Name",
      dataIndex: "displayId",
      key: "displayId",
      width: "5%",
      sorter: (a, b) => string_compare(a, b, "displayId"),
      ...nameSearchState,
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "12%",
      sorter: (a, b) => string_compare(a, b, "name"),
      ...titleSearchState,
    },
    {
      title: "Type",
      dataIndex: "workItemType",
      key: "workItemType",
      sorter: (a, b) => string_compare(a, b, "workItemType"),
      filters: workItemTypes.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
      width: "5%",
    },
    {
      title: "Lead Time",
      dataIndex: "leadTime",
      key: "leadTime",
      width: "5%",
      sorter: (a, b) => a.leadTime - b.leadTime,
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      width: "5%",
      sorter: (a, b) => a.cycleTime - b.cycleTime,
    },
    {
      title: "Delivery Latency",
      dataIndex: "latency",
      key: "latency",
      width: "5%",
      sorter: (a, b) => a.latency - b.latency,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: "5%",
      sorter: (a, b) => a.duration - b.duration,
    },
    {
      title: "Effort",
      dataIndex: "effort",
      key: "effort",
      width: "5%",
      sorter: (a, b) => a.effort - b.effort,
    },
    {
      title: "Authors",
      dataIndex: "authorCount",
      key: "authorCount",
      width: "5%",
      sorter: (a, b) => a.authorCount - b.authorCount,
    },
    {
      title: "Backlog Time",
      dataIndex: "backlogTime",
      key: "backlogTime",
      width: "5%",
      sorter: (a, b) => a.backlogTime - b.backlogTime,
    },
  ];

  return columns;
}

export const FlowMetricsDetailTable = injectIntl(({model, intl}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(model.map((x) => x.workItemType))];

  const columns = useFlowMetricsDetailTableColumns(workItemTypes);
  const dataSource = getTransformedData(model, intl);

  return (
    <Table
      rowClassName={(record, index) => index % 2 === 0 ? styles.tableRowLight :  styles.tableRowDark}
      size="small"
      pagination={false}
      columns={columns}
      dataSource={dataSource}
      scroll={{y: "60vh"}}
      showSorterTooltip={false}
      data-testid="flowmetrics-detail-table"
      bordered={true}
    />
  );
});
