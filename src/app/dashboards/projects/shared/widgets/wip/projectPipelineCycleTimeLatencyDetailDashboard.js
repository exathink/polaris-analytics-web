import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";
import {ProjectPipelineCycleTimeLatencyWidget} from "./projectPipelineCycleTimeLatencyWidget";
import {WorkItemStateTypes} from "../../../../shared/config";

const dashboard_id = "dashboards.project.pipeline.cycle_time_latency.detail";

export const ProjectPipelineCycleTimeLatencyDetailDashboard = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  workItemScope,
  setWorkItemScope,
  specsOnly,
  days,
  cycleTimeTarget,
  targetPercentile,
  includeSubTasks,
  view,
  context,
}) => {

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"50%"}
        title={``}
        subTitle={``}
        controls={[
          () => (
            <div style={{minWidth: "300px"}}>
              <Flex align={"center"}>
                <Box pr={2} w={"100%"}>
                  <WorkItemScopeSelector workItemScope={workItemScope} setWorkItemScope={setWorkItemScope} />
                </Box>
              </Flex>
            </div>
          ),
        ]}
      >
        <DashboardWidget
          w={1 / 2}
          name="engineering"
          render={({view}) => (
            <ProjectPipelineCycleTimeLatencyWidget
              instanceKey={instanceKey}
              view={view}
              stageName={"Engineering"}
              stateTypes={[WorkItemStateTypes.open, WorkItemStateTypes.make]}
              cycleTimeTarget={cycleTimeTarget}
              specsOnly={specsOnly}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              targetPercentile={targetPercentile}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={1 / 2}
          name="delivery"
          render={({view}) => {
            return (
              <ProjectPipelineCycleTimeLatencyWidget
                instanceKey={instanceKey}
                view={view}
                stageName={"Delivery"}
                stateTypes={[WorkItemStateTypes.deliver]}
                groupByState={true}
                cycleTimeTarget={cycleTimeTarget}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                targetPercentile={targetPercentile}
                specsOnly={specsOnly}
                workItemScope={workItemScope}
                setWorkItemScope={setWorkItemScope}
                includeSubTasks={includeSubTasks}
              />
            );
          }}
        />
      </DashboardRow>
      <DashboardRow h="45%">
        <DashboardWidget w={1} name="table-view" render={({view}) => <span>Table View Widget to be added here</span>} />
      </DashboardRow>
    </Dashboard>
  );
};
