import React from "react";

import { Dashboard, DashboardRow, DashboardWidget } from "../../../../framework/viz/dashboard";
import { Contexts } from "../../../../meta/contexts";
import { ProjectDashboard, useProjectContext } from "../../projectDashboard";
import { RepositoriesTableWidget } from "../../../shared/components/repositoriesTable/repositoriesTable";

const dashboard_id = 'dashboards.activity.organization.instance';


export const RepositorySummaryDashboard = () => {
  const {project, context} = useProjectContext();

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"100%"} title={Contexts.repositories.display()}>
        <DashboardWidget
          w={1}
          name="repositories-detail"
          render={({view}) => <RepositoriesTableWidget dimension="project" instanceKey={project.key} view={view} />}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
};
const dashboard = () => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <RepositorySummaryDashboard />
  </ProjectDashboard>
);

export default dashboard;