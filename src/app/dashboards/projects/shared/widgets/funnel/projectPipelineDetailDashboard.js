import React from "react";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../../framework/viz/dashboard";

import {ProjectPipelineFunnelWidget} from "./projectPipelineFunnelWidget";
import {StateMapPackedBubbleWidget} from "./stateMapPackedBubbleWidget";

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
      <DashboardRow h={1} title={`Title`} subTitle={`SubTitle`}>
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
              <StateMapPackedBubbleWidget
                instanceKey={instanceKey}
                context={context}
                latestWorkItemEvent={latestWorkItemEvent}
                latestCommit={latestCommit}
                days={30}
                view={view}
                context={context}
              />
            );
          }}
        />
      </DashboardRow>
    </Dashboard>
  );
};
