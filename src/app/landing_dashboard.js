import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../containers/Dashboard/index';
import {OrganizationActivitySummaryViz} from "./accounts/organizationActivitySummaryViz";

export const dashboard = (props) => (
  <Dashboard {...props}>
    <DashboardRow h='40%'>
      <DashboardItem name="account-organization-activity-summary" w={1}>
        <OrganizationActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;