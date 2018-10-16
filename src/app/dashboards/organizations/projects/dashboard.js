import React from 'react';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {OrganizationDashboard} from "../organizationDashboard";

import Projects from "../../projects/context"
import {toMoment} from "../../../helpers/utility";

const dashboard_id = 'dashboards.activity.organization.instance';


export default () => (
  <OrganizationDashboard
    render={
      ({organization, context}) => (
        <Dashboard
          dashboard={`${dashboard_id}`}
        >
          <DashboardRow h='22%' title={Contexts.projects.display()}>
            <DashboardWidget
              w={1 / 2}
              name="project-activity-levels"
              render={
                ({view}) =>
                  <ChildDimensionActivityProfileWidget
                    dimension={'organization'}
                    instanceKey={organization.key}
                    childDimension={'projects'}
                    context={context}
                    childContext={Projects}
                    enableDrillDown={true}
                    view={view}
                    pageSize={50}
                  />
              }
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 2}
              name="most-active-projects"
              render={
                ({view}) =>
                  <DimensionMostActiveChildrenWidget
                    dimension={'organization'}
                    instanceKey={organization.key}
                    childConnection={'recentlyActiveProjects'}
                    context={context}
                    childContext={Projects}
                    top={10}
                    latestCommit={organization.latestCommit}
                    days={1}
                    view={view}
                  />
              }
              showDetail={true}
            />
          </DashboardRow>
        </Dashboard>
      )
    }/>
);
