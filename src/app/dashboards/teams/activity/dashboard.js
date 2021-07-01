import React from "react";
import {FormattedMessage} from "react-intl.macro";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {TeamDashboard} from "../teamDashboard";

const dashboard_id = "dashboards.activity.teams.instance";
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage="Activity Overview" />,
};

export const dashboard = () => (
  <TeamDashboard
    pollInterval={60 * 1000}
    render={({team, context}) => {
      return (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h="15%">
            <DashboardWidget w={1} name="activity-summary" title={messages.topRowTitle} render={() => `${team.name}`} />
          </DashboardRow>
        </Dashboard>
      );
    }}
  />
);
export default dashboard;
