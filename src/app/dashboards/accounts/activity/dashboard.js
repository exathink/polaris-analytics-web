import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import ActivitySummaryViz from './activitySummaryViz';
import ActivityLevelDetailViz from "./activityLevelDetailViz";

export const dashboard = (props) => (
  <Dashboard dashboard={'account-dashboard'} {...props}>
    <DashboardRow h='20%'>
      <DashboardItem
        w={1}
        name="organizations-activity"
        title={"Account Overview"}
        primary={ActivitySummaryViz}
        detail={ActivityLevelDetailViz}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;