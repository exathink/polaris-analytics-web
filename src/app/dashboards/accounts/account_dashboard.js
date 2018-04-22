import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../index';
import {OrganizationActivitySummaryViz} from "./viz/organizationActivitySummaryViz";

export const dashboard = (props) => (
  <Dashboard dashboard={'account-dashboard'} {...props}>
    <DashboardRow h='20%'>
      <DashboardItem name="organizations-activity" title={"Account Overview"} w={1}>
        <OrganizationActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;