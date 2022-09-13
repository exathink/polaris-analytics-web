import React from "react";

import { Dashboard, DashboardRow, DashboardWidget } from "../../../../framework/viz/dashboard";
import { Contexts } from "../../../../meta/contexts";
import { ProjectDashboard } from "../../projectDashboard";
import { RepositoriesTableWidget, TABLE_HEIGHTS } from "../../../shared/components/repositoriesTable/repositoriesTable";

const dashboard_id = 'dashboards.activity.organization.instance';


export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60*1000}
    render={
      ({project, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>

          <DashboardRow h={"100%"} title={Contexts.repositories.display()}>
          <DashboardWidget
                w={1}
                name="repositories-detail"
                render={
                  ({view}) =>
                    <RepositoriesTableWidget
                      dimension="project"
                      instanceKey={project.key}
                      height={TABLE_HEIGHTS.SEVENTY_FIVE}
                      view={view}
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