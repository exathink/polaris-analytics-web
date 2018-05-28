import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";
import {ActivityLevelDetailView, ActivityLevelSummaryView} from '../../../views/activity/ActivityLevel';

import ModelBindings from './modelBindings';
import {Contexts} from "../../../meta/contexts";

export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard='organizations-dashboard' modelBindings={ModelBindings} {...rest}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title={Contexts.organizations.displays.overview()}
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.projects.display()}>
      <DashboardItem
        w={1/2}
        name="project-activity-levels"
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>

    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
  </Dashboard>

);
export default dashboard;