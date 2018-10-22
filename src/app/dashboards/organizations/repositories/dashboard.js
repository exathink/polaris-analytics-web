import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";
import {OrganizationDashboard} from "../organizationDashboard";
import Repositories from "../../repositories/context";

const dashboard_id = 'dashboards.activity.organization.instance';

export default () => (
  <OrganizationDashboard
    pollInterval={60*1000}
    render={(
      {organization, context}) => (
      <Dashboard
        dashboard={`${dashboard_id}`}
      >
        <DashboardRow h='22%' title={Contexts.repositories.display()}>
          <DashboardWidget
            w={1 / 2}
            name="project-activity-levels"
            render={
              ({view}) =>
                <ChildDimensionActivityProfileWidget
                  dimension={'organization'}
                  instanceKey={organization.key}
                  childDimension={'repositories'}
                  context={context}
                  childContext={Repositories}
                  enableDrillDown={true}
                  view={view}
                  pageSize={50}
                  referenceDate={organization.latestCommit}
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
                  dimension={'organization'}
                  instanceKey={organization.key}
                  childConnection={'recentlyActiveRepositories'}
                  context={context}
                  childContext={Repositories}
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
    )}
  />
);
