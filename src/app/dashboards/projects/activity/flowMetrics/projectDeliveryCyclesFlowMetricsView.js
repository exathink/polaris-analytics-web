import React, {useState} from 'react';
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "./flowMetricsScatterPlotChart";
import {useFetchProjectAggregateCycleMetrics} from "../hooks/useProjectAggregateCycleMetrics";

const projectDeliveryCycleFlowMetricsMeta = {
  leadTime: {
    display: 'Lead Time'
  },
  cycleTime: {
    display: 'Cycle Time'
  }
}

export const ProjectDeliveryCyclesFlowMetricsView = ({instanceKey, model, days, projectCycleMetrics,  initialMetric}) => {
  const groupings = ['leadTime', 'cycleTime'];
  const [selectedMetric, setSelectedMetric] = useState(initialMetric || 'leadTime');
  return (
    <React.Fragment>
      <GroupingSelector
        label={"Show"}
        groupings={
          groupings.map(
            grouping => ({
              key: grouping,
              display: projectDeliveryCycleFlowMetricsMeta[grouping].display
            })
          )
        }
        initialValue={selectedMetric}
        onGroupingChanged={setSelectedMetric}
      />
      <FlowMetricsScatterPlotChart
        days={days}
        model={model}
        selectedMetric={selectedMetric}
        metricsMeta={projectDeliveryCycleFlowMetricsMeta}
        projectCycleMetrics={projectCycleMetrics}
      />
    </React.Fragment>
  )

}