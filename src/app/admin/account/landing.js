import React from 'react';
import {Dashboard, DashboardRow} from '../../framework/viz/dashboard';
import {ManageUsersDashboardWidget} from "./users/manageUsers";

const dashboard_id = 'dashboards.admin.account';

export default function AccountAdminDashboard() {
  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"30%"}>
        <ManageUsersDashboardWidget w={1/2} name='users'/>
      </DashboardRow>
    </Dashboard>
  )
}
