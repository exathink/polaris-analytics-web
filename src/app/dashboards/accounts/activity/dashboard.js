import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from "../../../components/views/activity/ActivitySummary";
import {ActivityLevelDetailView} from "../../../components/views/activity/ActivityLevelDetail";

import ModelBindings from "./modelBindings";

export const dashboard = (props) => (
  <Dashboard dashboard={'account-dashboard'} modelBindings={ModelBindings} {...props}>
    <DashboardRow h='20%'>
      <DashboardItem
        w={1}
        name="organizations-activity"
        title={"Account Overview"}
        primary={ActivitySummaryViz}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;