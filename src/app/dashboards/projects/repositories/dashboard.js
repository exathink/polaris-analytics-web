import React from 'react';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {DimensionMostActiveChildrenWidget, DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import Repositories from "../../repositories/context";
import {ProjectDashboard} from "../projectDashboard";

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
          <DashboardRow h='81%'>
            <DashboardWidget
              w={1}
              name="commits"
              title={"Contributions"}
              render={
                ({view}) =>
                  <DimensionCommitsNavigatorWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    context={context}
                    view={view}
                    days={1}
                    latestCommit={project.latestCommit}
                    groupBy={'workItem'}
                    groupings={['workItem', 'repository', 'author']}
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