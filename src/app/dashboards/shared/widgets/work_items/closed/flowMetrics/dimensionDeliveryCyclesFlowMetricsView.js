import React, {useState} from "react";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../charts/flowMetricCharts/flowMetricsScatterPlotChart";
import {Checkbox, Drawer} from "antd";
import {Flex} from "reflexbox";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../helpers/metricsMeta";
import {FlowMetricsDetailTable} from "./flowMetricsDetailTable";
import {CardInspectorWidget} from "../../../../../work_items/cardInspector/cardInspectorWidget";

export const DimensionDeliveryCyclesFlowMetricsView = ({
  instanceKey,
  context,
  model,
  days,
  targetMetrics,
  initialMetric,
  defectsOnly,
  specsOnly,
  yAxisScale,
  setYAxisScale
}) => {
  const groupings = specsOnly
    ? ["leadTime", "cycleTime", "latency", "duration", "effort", "authors", "backlogTime"]
    : ["leadTime", "cycleTime", "backlogTime"];
  const [selectedMetric, setSelectedMetric] = useState(initialMetric || "leadTime");
  const [showEpics, setShowEpics] = useState(false);

  const [metricTarget, targetConfidence] = projectDeliveryCycleFlowMetricsMeta.getTargetsAndConfidence(selectedMetric, targetMetrics)
  
  const [showPanel, setShowPanel] = React.useState(false);
  const [workItemKey, setWorkItemKey] = React.useState();

  React.useEffect(() => {
    initialMetric && setSelectedMetric(initialMetric);
  }, [initialMetric]);

  return (
    <React.Fragment>
      <Flex w={0.95} justify={"space-between"}>
        {yAxisScale !== "table" && (
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
        )}
        {!defectsOnly && (
          <Checkbox checked={showEpics} onChange={(e) => setShowEpics(e.target.checked)}>
            Show Epics
          </Checkbox>
        )}
        {!defectsOnly && (
          <GroupingSelector
            label={"View"}
            value={yAxisScale}
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
                display: "Data",
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
              setShowPanel(true);
              setWorkItemKey(workItems[0].workItemKey);
            }
          }}
        />
      ) : (
        <FlowMetricsDetailTable tableData={model} setShowPanel={setShowPanel} setWorkItemKey={setWorkItemKey} />
      )}
      {workItemKey && (
        <Drawer placement="top" height={355} closable={false} onClose={() => setShowPanel(false)} visible={showPanel}>
          <CardInspectorWidget context={context} workItemKey={workItemKey} />
        </Drawer>
      )}
    </React.Fragment>
  );
};
