import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import CommitContributorTimespanTotals from './CommitsContributorTimespanTotals';
import {OrganizationActivitySummaryViz} from "../viz/organizationActivitySummaryViz";

export const dashboard = (props) => (
  <Dashboard dashboard={'account-dashboard'} {...props}>
    <DashboardRow h='20%'>
      <DashboardItem
        w={1}
        name="organizations-activity"
        title={"Account Overview"}
        primary={CommitContributorTimespanTotals}
        detail={OrganizationActivitySummaryViz}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;