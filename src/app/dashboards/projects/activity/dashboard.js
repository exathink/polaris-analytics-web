import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";
import {ActivityLevelDetailView, ActivityLevelSummaryView} from "../../../views/activity/ActivityLevel";

import ModelBindings from "./modelBindings";

export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard={'projects-dashboard'} modelBindings={ModelBindings} {...rest}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title="Project Overview"
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='22%' title="Repositories">
      <DashboardItem
        w={1/2}
        name="repository-activity-levels"
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
  </Dashboard>

);
export default dashboard;

