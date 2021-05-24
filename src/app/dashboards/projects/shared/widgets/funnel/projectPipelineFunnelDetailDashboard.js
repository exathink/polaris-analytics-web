import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";

import {WorkItemStateTypeMapWidget} from "../workItemStateTypeMap";
import {ProjectPipelineFunnelWidget} from "./projectPipelineFunnelWidget";
import {ProjectPhaseDetailWidget} from "../projectPhaseDetail";
import {Box, Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";

const dashboard_id = "dashboards.project.pipeline.detail";

export const ProjectPipelineFunnelDetailDashboard = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  days,
  view,
  context,
  pollInterval,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  leadTimeTarget,
  cycleTimeTarget,
  includeSubTasks,
}) => {
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow
        h={"47%"}
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
          w={1 / 3}
          name="project-pipeline-detailed"
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={instanceKey}
              context={context}
              workItemScope={workItemScope}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={days}
              view={view}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={2 / 3}
          name="workitem-statetype-map"
          render={({view}) => {
            return (
              <WorkItemStateTypeMapWidget
                instanceKey={instanceKey}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={days}
                view={view}
              />
            );
          }}
        />
      </DashboardRow>
      <DashboardRow h={"48%"}>
        <DashboardWidget
          w={1}
          name="project-pipeline-queues"
          render={({view}) => (
            <ProjectPhaseDetailWidget
              instanceKey={instanceKey}
              context={context}
              funnelView={true}
              specsOnly={specsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={days}
              closedWithinDays={days}
              view={view}
              leadTimeConfidenceTarget={leadTimeConfidenceTarget}
              cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
              leadTimeTarget={leadTimeTarget}
              cycleTimeTarget={cycleTimeTarget}
              includeSubTasks={includeSubTasks}
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
};
