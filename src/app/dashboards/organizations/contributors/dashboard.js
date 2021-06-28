import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {OrganizationDashboard} from '../organizationDashboard';
import {OrgTeamsTableWidget} from "./teams/orgTeamsTableWidget";
import Button from "../../../../components/uielements/button";
import {CreateNewTeamWidget} from "./teams/createNewTeam";

const dashboard_id = 'dashboards.contributors.organization';

const TopDashboard = () => (
  <OrganizationDashboard
    pollInterval={60*1000}
    render ={
      ({organization, context}) =>
      <Dashboard
        dashboard={`${dashboard_id}`}
      >
        <DashboardRow
          h="22%"
          title={Contexts.contributors.display()}
          controls={[
            () => (
              <Button type="primary" onClick={() => context.go(".", "manage-teams")}>
                Manage Teams
              </Button>
            ),
          ]}
        >
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
                  referenceDate={organization.latestCommit}
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
                  latestCommit={organization.latestCommit}
                  days={1}
                  view={view}
                />
            }
            showDetail={true}
          />
        </DashboardRow>
        <DashboardRow h={"68%"} 
             title={"Teams"}             
             controls={[() => <CreateNewTeamWidget organizationKey={organization.key} />]}>
          <DashboardWidget
            w={1}
            name={``}
            render={({view}) => <OrgTeamsTableWidget organizationKey={organization.key} />}
            showDetail={false}
          />
        </DashboardRow>
      </Dashboard>
    }
    />
);

export default TopDashboard;
