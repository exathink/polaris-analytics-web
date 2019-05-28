import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard} from '../../../framework/viz/dashboard';

import {AccountDashboard} from "../accountDashboard";

import {ManageUsersDashboardWidget} from "./users/manageUsers";

const dashboard_id = 'dashboards.admin.account';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Account Overview'/>
};

export const dashboard = () =>(
  <AccountDashboard
   render={
     ({account, context, match}) => {
       return (
         <Dashboard dashboard={`${dashboard_id}`}>
            <ManageUsersDashboardWidget name='users' account={account}/>
         </Dashboard>
       )
     }
   }
  />
);
export default dashboard;