import React from 'react';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {
  DimensionCommitsNavigatorWidget,
} from "../../shared/widgets/accountHierarchy";
import {ProjectDashboard, useProjectContext} from "../projectDashboard";
import {RepositoriesTableWidget} from "../../shared/components/repositoriesTable/repositoriesTable";
const dashboard_id = 'dashboards.activity.organization.instance';


export const RepositoryDashboard = () => {
  const {project, context} = useProjectContext();

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h="50%">
        <DashboardWidget
          w={1}
          name="commits"
          title={"Latest Commits"}
          render={({view}) => (
            <DimensionCommitsNavigatorWidget
              dimension={"project"}
              instanceKey={project.key}
              context={context}
              view={view}
              days={1}
              latestCommit={project.latestCommit}
              latestWorkItemEvent={project.latestWorkItemEvent}
              markLatest
              groupBy={"workItem"}
              groupings={["workItem", "repository", "branch", "author"]}
              showHeader
              showTable
            />
          )}
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h={"35%"} title={Contexts.repositories.display()}>
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
    <RepositoryDashboard />
  </ProjectDashboard>
);

export default dashboard;