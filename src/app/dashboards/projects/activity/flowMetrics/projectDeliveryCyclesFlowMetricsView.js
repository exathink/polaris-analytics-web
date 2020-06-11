import React, {useState} from 'react';
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "./flowMetricsScatterPlotChart";
import WorkItems from '../../../work_items/context';

const projectDeliveryCycleFlowMetricsMeta = {
  leadTime: {
    display: 'Lead Time',
    value : cycle => cycle.leadTime
  },
  cycleTime: {
    display: 'Cycle Time',
    value: cycle => cycle.cycleTime
  },
  backlogTime: {
    display: 'Backlog Time',
    value: cycle => cycle.cycleTime > 0 ? cycle.leadTime - cycle.cycleTime : 0
  }
}

export const ProjectDeliveryCyclesFlowMetricsView = ({instanceKey, context, model, days, projectCycleMetrics,  initialMetric, defectsOnly}) => {
  const groupings = ['leadTime', 'cycleTime', 'backlogTime']
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
        defectsOnly={defectsOnly}
        onSelectionChange={
          (workItems) => {
            if(workItems.length === 1) {
              context.navigate(WorkItems, workItems[0].displayId, workItems[0].workItemKey)
            }
          }
        }
      />
    </React.Fragment>
  )

}