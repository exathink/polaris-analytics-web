import React, {useState} from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";

import {WorkItemStateTypeMapWidget} from "../workItemStateTypeMap";
import {ProjectPipelineFunnelWidget} from "./projectPipelineFunnelWidget";
import {ProjectPipelineStateDetailsWidget} from "../wip";
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
}) => {
  const [workItemScope, setWorkItemScope] = useState("all");
  const specsOnly = workItemScope === "specs";

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
          w={1 / 3}
          name="project-pipeline-detailed"
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={instanceKey}
              context={context}
              workItemScope={workItemScope}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={30}
              view={view}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={2 / 3}
          name="project-pipeline-bubble"
          render={({view}) => {
            return (
              <WorkItemStateTypeMapWidget
                instanceKey={instanceKey}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={30}
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
            <ProjectPipelineStateDetailsWidget
              instanceKey={instanceKey}
              context={context}
              specsOnly={specsOnly}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={30}
              view={view}
            />
          )}
          showDetail={false}
        />
      </DashboardRow>
    </Dashboard>
  );
};
