import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionFlowMixTrendsWidget} from "./flowMixTrendsWidget";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {ProjectTraceabilityTrendsWidget} from "../../../commits/traceability";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState
} from "../../../../components/trendingControlBar/trendingControlBar";


const dashboard_id = 'dashboards.projects.trends.flow-mix.detail';

export const DimensionFlowMixTrendsDetailDashboard = (
  {
    dimension,
    instanceKey,
    measurementWindow,
    days,
    samplingFrequency,
    context,
    view,
    latestWorkItemEvent,
    latestCommit,
    includeSubTasks
  }
) => {

  const [workItemScope, setWorkItemScope] = useState('all');
  const specsOnly = workItemScope === 'specs';

  const [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ] = useTrendsControlBarState(45, 30, 7);

  return (
    <Dashboard id={dashboard_id}>
      <DashboardRow
        h={0.5}
        title={`Value Mix Trends`}
        controls={[
          ...getTrendsControlBarControls(
            [
              [daysRange, setDaysRange],
              [measurementWindowRange, setMeasurementWindowRange],
              [frequencyRange, setFrequencyRange]
            ]
          ),
          () => (
            <div style={{minWidth: "200px", padding: "15px"}}>
              <Flex align={'center'}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                  />
                </Box>
              </Flex>
            </div>

          ),
          ({view}) =>
            specsOnly &&
            <div style={{minWidth: "100px"}}>
              <Flex align={'start'}>
                <Box pr={2} w={"100%"}>
                  <ProjectTraceabilityTrendsWidget
                    instanceKey={instanceKey}
                    measurementWindow={30}
                    days={7}
                    samplingFrequency={7}
                    context={context}
                    view={view}
                    latestWorkItemEvent={latestWorkItemEvent}
                    latestCommit={latestCommit}
                    asStatistic={true}
                    primaryStatOnly={true}
                    target={0.9}
                  />
                </Box>
              </Flex>
            </div>
          ,
        ]}
      >
        < DashboardWidget
          w={1}
          name={'flow-mix'}
          render={
            ({view}) =>
              <DimensionFlowMixTrendsWidget
                dimension={dimension}
                instanceKey={instanceKey}
                measurementWindow={measurementWindowRange}
                days={daysRange}
                samplingFrequency={frequencyRange}
                context={context}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                specsOnly={specsOnly}
                asStatistic={false}
                showCounts={true}
                includeSubTasks={includeSubTasks}
              />

          }
        />
      </DashboardRow>
    </Dashboard>
  )
}