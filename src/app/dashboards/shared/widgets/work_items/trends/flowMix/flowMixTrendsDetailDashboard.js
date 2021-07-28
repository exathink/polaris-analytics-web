import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../../framework/viz/dashboard";
import {DimensionFlowMixTrendsWidget} from "./flowMixTrendsWidget";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../../../components/workItemScopeSelector/workItemScopeSelector";
import {
  getTrendsControlBarControls,
  useTrendsControlBarState,
} from "../../../../components/trendingControlBar/trendingControlBar";
import {useChildState} from "../../../../../../helpers/hooksUtil";

const dashboard_id = "dashboards.projects.trends.flow-mix.detail";

export const DimensionFlowMixTrendsDetailDashboard = (
  {
    dimension,
    instanceKey,
    measurementWindow,
    days,
    samplingFrequency,
    workItemScope: parentWorkItemScope,
    setWorkItemScope: parentSetWorkItemScope,
    context,
    view,
    latestWorkItemEvent,
    latestCommit,
    includeSubTasks

  }
) => {

  const [workItemScope, setWorkItemScope] = useChildState(parentWorkItemScope, parentSetWorkItemScope, 'specs');
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
            <div style={{minWidth: "220px", padding: "15px"}}>
              <Flex align={'center'}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector
                    display={['Effort', 'Volume']}
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                  />
                </Box>
              </Flex>
            </div>

          ),

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