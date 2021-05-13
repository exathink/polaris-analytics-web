import React, {useState} from "react";
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../shared/charts/flowMetricCharts/flowMetricsScatterPlotChart";
import WorkItems from "../../../../work_items/context";
import {Checkbox, Table} from "antd";
import {Flex} from "reflexbox";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";
import {useSearch} from "../../../../../components/tables/hooks";

export function useFlowMetricsDetailTableColumns(workItemTypes) {
  const nameSearchState = useSearch("displayId", {isWorkItemLink: true});
  const titleSearchState = useSearch("name", {isWorkItemLink: true});

  const columns = [
    {
      title: "Name",
      dataIndex: "displayId",
      key: "displayId",
      width: "5%",
      ...nameSearchState,
    },
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "12%",
      ...titleSearchState
    },
    {
      title: "Type",
      dataIndex: "workItemType",
      key: "workItemType",
      filters: workItemTypes.map(b => ({text: b, value: b})),
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

const getNumber = (num, intl) => {
    return intl.formatNumber(num, {maximumFractionDigits: 2})
};

function getTransformedData(data, intl) {
  return data.map(item => {
    debugger;
    return {
      ...item,
      leadTime: getNumber(item.leadTime, intl),
      cycleTime: getNumber(item.cycleTime, intl),
      deliveryLatency: getNumber(item.deliveryLatency, intl),
      duration: getNumber(item.duration, intl),
      effort: getNumber(item.effort, intl),
      authorCount: getNumber(item.authorCount, intl),
      latency: getNumber(item.latency, intl),
      backlogTime: getNumber(projectDeliveryCycleFlowMetricsMeta["backlogTime"].value(item), intl)
    }
  })
}

export const ProjectDeliveryCyclesFlowMetricsView = ({
  instanceKey,
  context,
  model,
  days,
  targetMetrics,
  initialMetric,
  defectsOnly,
  specsOnly,
  intl
}) => {
  const groupings = specsOnly
    ? ["leadTime", "cycleTime", "latency", "duration", "effort", "authors", "backlogTime"]
    : ["leadTime", "cycleTime", "backlogTime"];
  const [selectedMetric, setSelectedMetric] = useState(initialMetric || "leadTime");
  const [yAxisScale, setYAxisScale] = useState("logarithmic");
  const [showEpics, setShowEpics] = useState(false);

  const [metricTarget, targetConfidence] = projectDeliveryCycleFlowMetricsMeta.getTargetsAndConfidence(selectedMetric, targetMetrics)

  React.useEffect(() => {
    initialMetric && setSelectedMetric(initialMetric);
  }, [initialMetric]);

  // get unique workItem types
  const workItemTypes =  [...new Set(model.map(x => x.workItemType))]

  const columns = useFlowMetricsDetailTableColumns(workItemTypes);
  const dataSource = getTransformedData(model, intl);

  return (
    <React.Fragment>
      <Flex w={0.95} justify={"space-between"}>
        <GroupingSelector
          label={"Metric"}
          groupings={groupings.map((grouping) => ({
            key: grouping,
            display: projectDeliveryCycleFlowMetricsMeta[grouping].display,
          }))}
          initialValue={selectedMetric}
          value={selectedMetric}
          onGroupingChanged={setSelectedMetric}
        />
        {!defectsOnly && (
          <Checkbox checked={showEpics} onChange={(e) => setShowEpics(e.target.checked)}>
            Show Epics
          </Checkbox>
        )}
        {!defectsOnly && (
          <GroupingSelector
            label={"View"}
            groupings={[
              {
                key: "logarithmic",
                display: "Normal",
              },
              {
                key: "linear",
                display: "Outlier",
              },
              {
                key: "table",
                display: "Table",
              },
            ]}
            initialValue={"logarithmic"}
            onGroupingChanged={setYAxisScale}
          />
        )}
      </Flex>
      {yAxisScale !== "table" ? (
        <FlowMetricsScatterPlotChart
          days={days}
          model={model}
          selectedMetric={selectedMetric}
          metricsMeta={projectDeliveryCycleFlowMetricsMeta}
          metricTarget={metricTarget}
          targetConfidence={targetConfidence}
          defectsOnly={defectsOnly}
          specsOnly={specsOnly}
          showEpics={showEpics}
          yAxisScale={yAxisScale}
          onSelectionChange={(workItems) => {
            if (workItems.length === 1) {
              context.navigate(WorkItems, workItems[0].displayId, workItems[0].workItemKey);
            }
          }}
        />
      ) : (
        <Table
          size="small"
          pagination={false}
          columns={columns}
          dataSource={dataSource}
          scroll={{y: "60vh"}}
          showSorterTooltip={false}
          data-testid="flowmetrics-detail-table"
          bordered={true}
        />
      )}
    </React.Fragment>
  );
};
