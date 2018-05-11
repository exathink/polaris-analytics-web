import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from "./activitySummaryViz";
import {ActivityLevelDetailViz} from "./activityLevelDetailViz";

export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard={'projects-dashboard'} {...rest}>
    <DashboardRow h='40%'>
      <DashboardItem
        w={1}
        name="repositories-activity"
        primary={ActivitySummaryViz}
        detail={ActivityLevelDetailViz}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;