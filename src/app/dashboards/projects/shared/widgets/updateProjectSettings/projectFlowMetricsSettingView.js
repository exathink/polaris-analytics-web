import React from "react";
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../shared/charts/flowMetricCharts/flowMetricsScatterPlotChart";
import WorkItems from "../../../../work_items/context";
import {Flex} from "reflexbox";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";
import {METRICS, actionTypes} from "../../../configure/constants";

export const ProjectFlowMetricsSettingView = ({
  instanceKey,
  context,
  model,
  days,
  projectCycleMetrics,
  selectedMetricState,
  defectsOnly,
  specsOnly,
}) => {
  const groupings = [METRICS.LEAD_TIME, METRICS.CYCLE_TIME];
  const {selectedMetric, dispatch} = selectedMetricState;
  return (
    <React.Fragment>
      <Flex w={0.95} justify={"center"}>
        <GroupingSelector
          label={" "}
          groupings={groupings.map((grouping) => ({
            key: grouping,
            display: projectDeliveryCycleFlowMetricsMeta[grouping].display,
          }))}
          initialValue={selectedMetric}
          onGroupingChanged={(newState) => dispatch({type: actionTypes.UPDATE_METRIC, payload: newState})}
        />
      </Flex>
      <FlowMetricsScatterPlotChart
        days={days}
        model={model}
        selectedMetric={selectedMetric}
        metricsMeta={projectDeliveryCycleFlowMetricsMeta}
        projectCycleMetrics={projectCycleMetrics}
        defectsOnly={defectsOnly}
        specsOnly={specsOnly}
        yAxisScale={"logarithmic"}
        onSelectionChange={(workItems) => {
          if (workItems.length === 1) {
            context.navigate(WorkItems, workItems[0].displayId, workItems[0].workItemKey);
          }
        }}
      />
    </React.Fragment>
  );
};
