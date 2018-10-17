import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";
import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";
import {AccountDashboard} from "../accountDashboard";

const dashboard_id = 'dashboards.contributors.account';

export const dashboard = () => (
  <AccountDashboard
  render={
    ({account, context}) => {
      return (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h='22%' title={Contexts.contributors.display()}>
            <DashboardWidget
              w={1 / 2}
              name="contributors-activity-profile"
              render={
                ({view}) =>
                  <DimensionContributorActivityProfileWidget
                    dimension={'account'}
                    childDimension={'contributors'}
                    instanceKey={account.key}
                    context={context}
                    childContext={Contributors}
                    enableDrillDown={true}
                    suppressDataLabelsAt={500}
                    pageSize={50}
                    view={view}
                  />}
              showDetail={true}
            />
          </DashboardRow>
        </Dashboard>
      )
    }
  }/>
);
export default dashboard;