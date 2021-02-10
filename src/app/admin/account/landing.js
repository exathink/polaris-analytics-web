import React from 'react';
import {Dashboard, DashboardRow} from '../../framework/viz/dashboard';
import {ManageUsersDashboardWidget} from "./users/manageUsers";
import {AccountContributorsTableWidget} from './contributors/accountContributorsTableWidget';

const dashboard_id = 'dashboards.admin.account';

export default function AccountAdminDashboard() {
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"50%"}>
        <ManageUsersDashboardWidget w={1/2} name='users'/>
        <AccountContributorsTableWidget w={1/2} name="account-contributors"/>
      </DashboardRow>
    </Dashboard>
  )
}
