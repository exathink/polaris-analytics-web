import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from './activitySummaryViz';
import {ActivityLevelDetailViz} from "./activityLevelDetailViz";

export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard='organizations-dashboard' {...rest}>
    <DashboardRow h='40%'>
      <DashboardItem
        w={1}
        name="activity-level-detail"
        primary={ActivitySummaryViz}
        detail={ActivityLevelDetailViz}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;