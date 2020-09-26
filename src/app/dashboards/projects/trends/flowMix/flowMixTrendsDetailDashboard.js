import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectFlowMixTrendsWidget} from "./flowMixTrendsWidget";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector";

const dashboard_id = 'dashboards.projects.trends.flow-mix.detail';

export const ProjectFlowMixTrendsDetailDashboard = (
  {
    instanceKey,
    measurementWindow,
    days,
    samplingFrequency,
    context,
    view,
    latestWorkItemEvent,
    latestCommit,

  }
) => {

  const [workItemScope, setWorkItemScope] = useState('specs');
  const specsOnly = workItemScope === 'specs';


  return (
    <Dashboard id={dashboard_id}>
      <DashboardRow
        h={0.5}
        title={`Flow Mix Trends: Last 45 days`}
        controls={[
          () => (
            <div style={{minWidth: "300px", padding: "15px"}}>
              <Flex align={'center'}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector
                    workItemScope={workItemScope}
                    setWorkItemScope={setWorkItemScope}
                  />
                </Box>
              </Flex>
            </div>

          )
        ]}
      >
        < DashboardWidget
          w={1}
          name={'flow-mix'}
          render={
            ({view}) =>
              <ProjectFlowMixTrendsWidget
                instanceKey={instanceKey}
                measurementWindow={30}
                days={45}
                samplingFrequency={7}
                context={context}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                specsOnly={specsOnly}
                asStatistic={false}
                showCounts={true}
              />

          }
        />
      </DashboardRow>
    </Dashboard>
  )
}