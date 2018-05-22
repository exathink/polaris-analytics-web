import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivityLevelDetailView, ActivityLevelSummaryView} from "../../../views/activity/ActivityLevelDetail";
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";

import ModelBindings from "./modelBindings";

export const dashboard = (props) => (
  <Dashboard dashboard={'account-dashboard'} modelBindings={ModelBindings} {...props}>
    <DashboardRow h='20%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='20%'>
      <DashboardItem
        w={1}
        name="org-activity-levels"
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;