import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../Dashboard/index';
import {ProjectActivitySummaryViz} from '../../viz/organizations/projectActivitySummaryViz';
import {OrganizationActivitySummaryViz} from "../../viz/accounts/organizationActivitySummaryViz";

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