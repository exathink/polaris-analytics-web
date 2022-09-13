import React from "react";

import { Dashboard, DashboardRow, DashboardWidget } from "../../../../framework/viz/dashboard";
import { DimensionCommitsNavigatorWidget } from "../../../shared/widgets/accountHierarchy";
import { ProjectDashboard } from "../../projectDashboard";

const dashboard_id = 'dashboards.activity.organization.instance';


export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60*1000}
    render={
      ({project, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h='93%' >
            <DashboardWidget
                w={1}
                name="commits"
                title={"Latest Commits"}
                render={
                  ({view}) =>
                    <DimensionCommitsNavigatorWidget
                      dimension={'project'}
                      instanceKey={project.key}
                      context={context}
                      view={view}
                      days={1}
                      latestCommit={project.latestCommit}
                      latestWorkItemEvent={project.latestWorkItemEvent}
                      markLatest
                      groupBy={'workItem'}
                      groupings={
                          ['workItem', 'repository','branch', 'author',  ]
                      }
                      showHeader
                      showTable
                    />
                }
                showDetail={true}
              />
          </DashboardRow>

        </Dashboard>
      )
    }
  />
);
export default dashboard;