import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivityLevelDetailView, ActivityLevelSummaryView} from "../../../views/activity/ActivityLevelDetail";
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";

import ModelBindings from "./modelBindings";

export const dashboard = (props) => (
  <Dashboard dashboard={'account-dashboard'} modelBindings={ModelBindings} {...props}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title="Account Overview"
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='22%' title="Organizations">
      <DashboardItem
        w={1/2}
        name="org-activity-levels"
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
    <DashboardRow h='22%' title="Organizations">
      <DashboardItem
        w={1/2}
        name="org-activity-levels-3"
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
      <DashboardItem
        w={1/2}
        name="org-activity-levels-4"

        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
    <DashboardRow h='22%' title="Organizations">
      <DashboardItem
        w={1/2}
        name="org-activity-levels-5"
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
      <DashboardItem
        w={1/2}
        name="org-activity-levels-6"

        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;