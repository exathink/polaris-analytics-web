import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivityLevelDetailView, ActivityLevelSummaryView} from "../../../views/activity/ActivityLevel";
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";

import ModelBindings from "./modelBindings";
import {Contexts} from "../../../meta/contexts";

export const dashboard = (props) => (
  <Dashboard dashboard={'account-dashboard'} modelBindings={ModelBindings} {...props}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title={Contexts.accounts.displays.overview()}
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.organizations.display()}>
      <DashboardItem
        w={1/2}
        name="org-activity-levels"
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.projects.display()}>

    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>

    </DashboardRow>
  </Dashboard>

);
export default dashboard;