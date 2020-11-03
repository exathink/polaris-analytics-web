import React, {useState} from 'react';
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "./flowMetricsScatterPlotChart";
import WorkItems from '../../../../work_items/context';
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
  duration: {
    display: 'Duration',
    value: cycle => cycle.duration
  },
  latency: {
    display: 'Delivery Latency',
    value: cycle => cycle.latency
  },
  effort: {
    display: 'Effort',
    value: cycle => cycle.effort
  },
  authors: {
    display: 'Authors',
    value: cycle => cycle.authorCount
  },
  backlogTime: {
    display: 'Backlog Time',
    value: cycle => cycle.cycleTime > 0 ? cycle.leadTime - cycle.cycleTime : 0
  }
}

export const ProjectDeliveryCyclesFlowMetricsView = ({instanceKey, context, model, days, projectCycleMetrics, initialMetric, defectsOnly, specsOnly}) => {
  const groupings = specsOnly ?  ['leadTime', 'cycleTime', 'latency', 'duration', 'effort', 'authors', 'backlogTime']: ['leadTime', 'cycleTime', 'backlogTime']
  const [selectedMetric, setSelectedMetric] = useState(initialMetric || 'leadTime');
  const [yAxisScale, setYAxisScale] = useState('logarithmic')
  const [showEpics, setShowEpics] = useState(false);

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
            checked={showEpics}
            onChange={
              e => setShowEpics(e.target.checked)
            }
          >
            Show Epics
          </Checkbox>
        }
        {
          !defectsOnly &&
          <GroupingSelector
            label={"View"}
            groupings={
              [

                {
                  key: 'logarithmic',
                  display: 'Normal'
                },
                {
                  key: 'linear',
                  display: 'Outlier'
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
        specsOnly={specsOnly}
        showEpics={showEpics}
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