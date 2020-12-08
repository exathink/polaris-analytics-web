import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";

import {WorkItemStateTypeMapWidget} from "../workItemStateTypeMap";
import {ProjectPipelineFunnelWidget} from "./projectPipelineFunnelWidget";
import {ProjectPipelineStateDetailsWidget} from "../wip";

const dashboard_id = "dashboards.project.pipeline.detail";

export const ProjectPipelineDetailDashboard = ({
  instanceKey,
  latestWorkItemEvent,
  latestCommit,
  workItemScope,
  setWorkItemScope,
  days,
  view,
  context,
  pollInterval,
}) => {
  return (
    <Dashboard dashboard={dashboard_id}>
      <DashboardRow h={"50%"} title={``} subTitle={``}>
        <DashboardWidget
          w={1 / 3}
          name="project-pipeline-detailed"
          render={({view}) => (
            <ProjectPipelineFunnelWidget
              instanceKey={instanceKey}
              context={context}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
              latestWorkItemEvent={latestWorkItemEvent}
              latestCommit={latestCommit}
              days={30}
              view={view}
            />
          )}
          showDetail={false}
        />
        <DashboardWidget
          w={2/3}
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
      <DashboardRow h={"50%"}>
        <DashboardWidget
          w={1}
          name="project-pipeline-queues"
          render={({view}) => (
            <ProjectPipelineStateDetailsWidget
              instanceKey={instanceKey}
              context={context}
              workItemScope={workItemScope}
              setWorkItemScope={setWorkItemScope}
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
