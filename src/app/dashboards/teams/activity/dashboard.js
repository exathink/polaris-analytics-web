import React from 'react';
import {FormattedMessage} from 'react-intl.macro';
import {TeamDashboard} from "../teamDashboard";

const dashboard_id = 'dashboards.activity.teams.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};


export const dashboard = () => (
  <TeamDashboard
    pollInterval={60*1000}
    render={
      ({team, context}) => {
        return `${team.name} - ${team.key}`
      }
    }
  />
);
export default dashboard;
