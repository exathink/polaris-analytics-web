import React, {useState} from "react";
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../shared/charts/flowMetricCharts/flowMetricsScatterPlotChart";
import WorkItems from "../../../../work_items/context";
import {Checkbox, Table} from "antd";
import {Flex} from "reflexbox";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";
import {useSearch} from "../../../../../components/tables/hooks";

export function useFlowMetricsDetailTableColumns() {
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
      filters: ["story", "task", "bug"].map(b => ({text: b, value: b})),
      onFilter: (value, record) => record.workItemType.indexOf(value) === 0,
      width: "5%",
    },
    {
      title: "Lead Time",
      dataIndex: "leadTime",
      key: "leadTime",
      width: "5%",
    },
    {
      title: "Cycle Time",
      dataIndex: "cycleTime",
      key: "cycleTime",
      width: "5%",
    },
    {
      title: "Delivery Latency",
      dataIndex: "deliveryLatency",
      key: "deliveryLatency",
      width: "5%",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: "5%",
    },
    {
      title: "Effort",
      dataIndex: "effort",
      key: "effort",
      width: "5%",
    },
    {
      title: "Authors",
      dataIndex: "authorCount",
      key: "authorCount",
      width: "5%",
    },
    {
      title: "Backlog Time",
      dataIndex: "latency",
      key: "latency",
      width: "5%",
    },
  ];

  return columns;
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

  const columns = useFlowMetricsDetailTableColumns();
  const dataSource = model;

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
{yAxisScale !== "table" ? <FlowMetricsScatterPlotChart
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
      /> :
      <Table
        loading={false}
        size="small"
        pagination={false}
        columns={columns}
        dataSource={dataSource}
        scroll={{y: "60vh"}}
        showSorterTooltip={false}
        data-testid="flowmetrics-detail-table"
        bordered={true}
      />}
    </React.Fragment>
  );
};
