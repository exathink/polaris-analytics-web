import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {OrganizationDashboard} from '../organizationDashboard';

const dashboard_id = 'dashboards.contributors.organization';

export default () => (
  <OrganizationDashboard
    render ={
      ({organization, context, onDashboardMounted}) =>
      <Dashboard
        dashboard={`${dashboard_id}`}
        onDashboardMounted={onDashboardMounted}
      >
        <DashboardRow h='22%' title={Contexts.contributors.display()}>
          <DashboardWidget
            w={1 / 2}
            name="contributors-activity-profile"
            render={
              ({view}) =>
                <DimensionContributorActivityProfileWidget
                  dimension={'organization'}
                  childDimension={'contributors'}
                  instanceKey={organization.key}
                  context={context}
                  childContext={Contributors}
                  enableDrillDown={true}
                  suppressDataLabelsAt={500}
                  view={view}
                  pageSize={50}
                />}
            showDetail={true}
          />
          <DashboardWidget
            w={1 / 2}
            name="most-active-contributors"
            render={
              ({view}) =>
                <DimensionMostActiveChildrenWidget
                  dimension={'organization'}
                  instanceKey={organization.key}
                  childConnection={'recentlyActiveContributors'}
                  context={context}
                  childContext={Contributors}
                  top={10}
                  days={1}
                  view={view}
                />
            }
            showDetail={true}
          />
        </DashboardRow>
      </Dashboard>
    }
    />
);
