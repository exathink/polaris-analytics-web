import {useSearchMultiCol} from "../../../../../../components/tables/hooks";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../helpers/metricsMeta";
import {injectIntl} from "react-intl";
import {StripeTable, SORTER} from "../../../../../../components/tables/tableUtils";
import {formatDateTime} from "../../../../../../i18n";
import {toMoment} from "../../../../../../helpers/utility";
import {joinTeams} from "../../../../helpers/teamUtils";
import styles from "./flowMetrics.module.css";
import {comboColumnTitleRender, customColumnRender, getStateTypeIcon} from "../../../../../projects/shared/helper/renderers";
import {allPairs, getHistogramCategories} from "../../../../../projects/shared/helper/utils";


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

function renderTeamsCol(setShowPanel, setWorkItemKey) {
  return (text, record, searchText) => {
    return (
      text && (
        <span
          onClick={() => {
            setShowPanel(true);
            setWorkItemKey(record.workItemKey);
          }}
          style={{cursor: "pointer", fontWeight: 500}}
        >
          {record.teamNodeRefs.length > 1 ? "Multiple" : text}
        </span>
      )
    );
  };
}



export function useFlowMetricsDetailTableColumns(filters, {setShowPanel, setWorkItemKey}, selectedMetric) {
  const titleSearchState = useSearchMultiCol(["name", "displayId", "epicName"], {customRender: comboColumnTitleRender(setShowPanel, setWorkItemKey)});
  const metricRenderState = {render: customColumnRender({setShowPanel, setWorkItemKey,colRender: text => <>{text} days</>, className: styles.flowMetricXs})}
  const effortRenderState = {render: customColumnRender({setShowPanel, setWorkItemKey,colRender: text => <>{text} dev-days</>, className: styles.flowMetricXs})}
  const stateTypeRenderState = {render: customColumnRender({setShowPanel, setWorkItemKey, colRender: (text, record) => <div style={{display: "flex", alignItems: "center"}}>{getStateTypeIcon(record.stateType)} {text.toLowerCase()}</div>, className: styles.flowMetricXs})}
  const renderState = {render: customColumnRender({setShowPanel, setWorkItemKey, className: styles.flowMetricXs})}
  const renderTeamsColState = {render: renderTeamsCol(setShowPanel, setWorkItemKey)}

  function testMetric(value, record, metric) {
    const [part1, part2] = filters.allPairsData[filters.categories.indexOf(value)];
    return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
  }

  let defaultOptionalCol = {
    title: "Effort",
    dataIndex: "effort",
    key: "effort",
    filters: filters.categories.map((b) => ({text: b, value: b})),
    onFilter: (value, record) => testMetric(value, record, "effort"),
    width: "5%",
    sorter: (a, b) => SORTER.number_compare(a.effort, b.effort),
    ...effortRenderState,
  };
  if (selectedMetric === "duration") {
    defaultOptionalCol = {
      title: "Coding",
      dataIndex: "duration",
      key: "duration",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "duration"),
      width: "5%",
      sorter: (a, b) => a.duration - b.duration,
      ...metricRenderState,
    };
  }
  if (selectedMetric === "latency") {
    defaultOptionalCol = {
      title: "Delivery",
      dataIndex: "latency",
      key: "latency",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "latency"),
      width: "5%",
      sorter: (a, b) => a.latency - b.latency,
      ...metricRenderState,
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
      ...renderTeamsColState,
    },
    // {
    //   title: "Name",
    //   dataIndex: "displayId",
    //   key: "displayId",
    //   width: "5%",
    //   sorter: (a, b) => SORTER.string_compare(a.displayId, b.displayId),
    //   ...nameSearchState,
    // },
    {
      title: "CARD",
      dataIndex: "name",
      key: "name",
      filters: filters.epicNames.map(b => ({text: b, value: b})),
      width: "14%",
      sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
      ...titleSearchState,
    },
    // {
    //   title: "Type",
    //   dataIndex: "workItemType",
    //   key: "workItemType",
    //   sorter: (a, b) => SORTER.string_compare(a.workItemType, b.workItemType),
    //   filters: filters.workItemTypes.map((b) => ({text: b, value: b})),
    //   onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
    //   width: "5%",
    //   ...renderState,
    // },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      sorter: (a, b) => SORTER.string_compare(a.state, b.state),
      width: "7%",
      ...stateTypeRenderState,
    },
    {
      title: "Lead Time",
      dataIndex: "leadTime",
      key: "leadTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "leadTime"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.leadTime, b.leadTime),
      ...metricRenderState,
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "cycleTime"),
      width: "5%",
      sorter: (a, b) => SORTER.number_compare(a.cycleTime, b.cycleTime),
      ...metricRenderState,
    },
    // {
    //   title: "Coding",
    //   dataIndex: "duration",
    //   key: "duration",
    //   filters: filters.categories.map((b) => ({text: b, value: b})),
    //   onFilter: (value, record) => testMetric(value, record, "duration"),
    //   width: "5%",
    //   sorter: (a, b) => a.duration - b.duration,
    //   ...renderState,
    // },
    //  {
    //   title: "Effort",
    //    dataIndex: "effort",
    //    key: "effort",
    //    filters: filters.categories.map((b) => ({text: b, value: b})),
    //    onFilter: (value, record) => testMetric(value, record, "effort"),
    //    width: "5%",
    //    sorter: (a, b) => SORTER.number_compare(a.effort, b.effort),
    //    ...effortRenderState

    //  },
      defaultOptionalCol,
    // {
    //   title: "Delivery",
    //   dataIndex: "latency",
    //   key: "latency",
    //   filters: filters.categories.map((b) => ({text: b, value: b})),
    //   onFilter: (value, record) => testMetric(value, record, "latency"),
    //   width: "5%",
    //   sorter: (a, b) => a.latency - b.latency,
    //   ...renderState,
    // },
    // {
    //   title: "Authors",
    //   dataIndex: "authorCount",
    //   key: "authorCount",
    //   width: "5%",
    //   sorter: (a, b) => a.authorCount - b.authorCount,
    //   ...renderState,
    // },
    /*
    {
      title: "Backlog Time",
      dataIndex: "backlogTime",
      key: "backlogTime",
      filters: filters.categories.map((b) => ({text: b, value: b})),
      onFilter: (value, record) => testMetric(value, record, "backlogTime"),
      width: "6%",
      sorter: (a, b) => a.backlogTime - b.backlogTime,
      ...metricRenderState,
    },
    */
    {
      title: "Closed At",
      dataIndex: "endDate",
      key: "endDate",
      width: "6%",
      sorter: (a, b) => SORTER.date_compare(a.endDate, b.endDate),
      ...renderState,
    },
  ];

  return columns;
}


export const FlowMetricsDetailTable = injectIntl(({tableData, intl, setShowPanel, setWorkItemKey, colWidthBoundaries, selectedMetric}) => {
  // get unique workItem types
  const workItemTypes = [...new Set(tableData.map((x) => x.workItemType))];
  const teams = [...new Set(tableData.flatMap((x) => x.teamNodeRefs.map((t) => t.teamName)))];
  const categories = getHistogramCategories(colWidthBoundaries);
  const allPairsData = allPairs(colWidthBoundaries);
  const epicNames = [...new Set(tableData.filter(x => Boolean(x.epicName)).map((x) => x.epicName))];
  const columns = useFlowMetricsDetailTableColumns({workItemTypes, teams, categories, allPairsData, epicNames}, {setShowPanel, setWorkItemKey}, selectedMetric);
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
