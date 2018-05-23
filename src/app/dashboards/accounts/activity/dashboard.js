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
        title="Account Overview"
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='30%'>
      <DashboardItem
        w={1/2}
        name="org-activity-levels"
        title="Organizations"
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
      <DashboardItem
        w={1/2}
        name="org-activity-levels-2"

        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;