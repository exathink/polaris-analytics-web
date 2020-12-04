import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";

import {WorkItemStateTypeMapWidget} from "../workItemStateType";

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
      <DashboardRow h={1} title={``} subTitle={``}>
        {/* <DashboardWidget
          w={1 / 2}
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
        /> */}
        <DashboardWidget
          w={1}
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
    </Dashboard>
  );
};
