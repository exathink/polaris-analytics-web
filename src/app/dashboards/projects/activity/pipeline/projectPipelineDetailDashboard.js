import React, {useState} from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectPhaseSummaryWidget} from "./projectPhaseSummaryWidget";
import {ProjectPipelineStateDetailsWidget} from "./projectPipelineStateDetailsWidget";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector";


const dashboard_id = 'dashboards.activity.projects.pipeline.detail';

export const ProjectPipelineDetailDashboard = (
  {
    instanceKey,
    context,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile
  }) => {
  const [workItemScope, setWorkItemScope] = useState('specs');
  const specsOnly = workItemScope === 'specs';

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"15%"}
        title={`Work In Progress`}
        controls={[
          () => (
            <div style={{padding: "10px"}}>
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
        <DashboardWidget
          w={1 / 4}
          name="project-pipeline-summary-detail-view"
          subtitle={specsOnly ? `Active Specs by Phase`: `All Active Work Items by Phase`}
          render={
            ({view}) =>
              <ProjectPhaseSummaryWidget
                instanceKey={instanceKey}
                specsOnly={specsOnly}
                view={view}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
              />
          }
          showDetail={false}
        />
      </DashboardRow>
      <DashboardRow h={"81%"}>
        <DashboardWidget
          w={1}
          name="project-pipeline-state-detail-view"
          render={
            ({view}) =>
              <ProjectPipelineStateDetailsWidget
                instanceKey={instanceKey}
                specsOnly={specsOnly}
                view={view}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                stateMappingIndex={stateMappingIndex}
                days={days}
                targetPercentile={cycleTimeTargetPercentile}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
};