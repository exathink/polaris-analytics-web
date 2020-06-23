import React, {useState} from 'react';
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "./flowMetricsScatterPlotChart";
import WorkItems from '../../../work_items/context';
import {Checkbox} from 'antd';
import {Flex} from 'reflexbox';

const projectDeliveryCycleFlowMetricsMeta = {
  leadTime: {
    display: 'Lead Time',
    value: cycle => cycle.leadTime
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

export const ProjectDeliveryCyclesFlowMetricsView = ({instanceKey, context, model, days, projectCycleMetrics, initialMetric, defectsOnly}) => {
  const groupings = ['leadTime', 'cycleTime', 'backlogTime']
  const [selectedMetric, setSelectedMetric] = useState(initialMetric || 'leadTime');
  const [yAxisScale, setYAxisScale] = useState('logarithmic')
  const [showEpicsAndSubTasks, setShowEpicsAndSubTasks] = useState(false);

  return (
    <React.Fragment>
      <Flex w={0.95} justify={'space-between'}>
        <GroupingSelector
          label={"Metric"}
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
        {
          !defectsOnly &&
          <Checkbox
            checked={showEpicsAndSubTasks}
            onChange={
              e => setShowEpicsAndSubTasks(e.target.checked)
            }
          >
            Show Epics & Sub-tasks
          </Checkbox>
        }
        {
          !defectsOnly &&
          <GroupingSelector
            label={"Y-Axis"}
            groupings={
              [

                {
                  key: 'logarithmic',
                  display: 'Log'
                },
                {
                  key: 'linear',
                  display: 'Linear'
                },
              ]
            }
            initialValue={'logarithmic'}
            onGroupingChanged={setYAxisScale}
          />
        }

      </Flex>
      <FlowMetricsScatterPlotChart
        days={days}
        model={model}
        selectedMetric={selectedMetric}
        metricsMeta={projectDeliveryCycleFlowMetricsMeta}
        projectCycleMetrics={projectCycleMetrics}
        defectsOnly={defectsOnly}
        showEpicsAndSubTasks={showEpicsAndSubTasks}
        yAxisScale={yAxisScale}
        onSelectionChange={
          (workItems) => {
            if (workItems.length === 1) {
              context.navigate(WorkItems, workItems[0].displayId, workItems[0].workItemKey)
            }
          }
        }
      />
    </React.Fragment>
  )

}