import React, {useState} from "react";
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../shared/charts/flowMetricCharts/flowMetricsScatterPlotChart";
import WorkItems from "../../../../work_items/context";
import {Checkbox} from "antd";
import {Flex} from "reflexbox";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";

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

  const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = targetMetrics;
  let metricTarget;
  let targetConfidence;
  if (selectedMetric === "leadTime") {
    metricTarget = leadTimeTarget;
    targetConfidence = leadTimeConfidenceTarget;
  } else if (selectedMetric === "effort" || selectedMetric === "authors") {
    metricTarget = null;
    targetConfidence = null;
  } else {
    metricTarget = cycleTimeTarget;
    targetConfidence = cycleTimeConfidenceTarget;
  }

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
            ]}
            initialValue={"logarithmic"}
            onGroupingChanged={setYAxisScale}
          />
        )}
      </Flex>
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
    </React.Fragment>
  );
};
