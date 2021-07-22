import React from 'react';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import Repositories from "../../repositories/context";
import {ProjectDashboard} from "../projectDashboard";
import {RepositoriesTableWidget} from "../../shared/components/repositoriesTable/repositoriesTable";
const dashboard_id = 'dashboards.activity.organization.instance';


export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60*1000}
    render={
      ({project, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h='22%' title={Contexts.repositories.display()}>
            <DashboardWidget
              w={1 / 2}
              name="repository-activity-levels"
              render={
                ({view}) =>
                  <ChildDimensionActivityProfileWidget
                    dimension={'project'}
                    instanceKey={context.getInstanceKey('project')}
                    childDimension={'repositories'}
                    context={context}
                    childContext={Repositories}
                    enableDrillDown={true}
                    view={view}
                    pageSize={50}
                    referenceDate={project.latestCommit}
                  />
              }
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 2}
              name="most-active-repositories"
              render={
                ({view}) =>
                  <DimensionMostActiveChildrenWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    childConnection={'recentlyActiveRepositories'}
                    context={context}
                    childContext={Repositories}
                    top={10}
                    latestCommit={project.latestCommit}
                    days={1}
                    view={view}
                  />
              }
              showDetail={true}
            />
          </DashboardRow>
          <DashboardRow h={"68%"}>
          <DashboardWidget
                w={1}
                name="repositories"
                render={
                  () =>
                    <RepositoriesTableWidget
                      dimension="project"
                      instanceKey={project.key}
                    />
                }
                showDetail={false}
              />
          </DashboardRow>

        </Dashboard>
      )
    }
  />
);
export default dashboard;