import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from "../../../components/views/activity/ActivitySummary";
import {ActivityLevelDetailView} from '../../../components/views/activity/ActivityLevelDetail';

import ModelBindings from './modelBindings';

export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard='organizations-dashboard' modelBindings={ModelBindings} {...rest}>
    <DashboardRow h='40%'>
      <DashboardItem
        w={1}
        name="activity-level-detail"
        primary={ActivitySummaryViz}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
  </Dashboard>

);
export default dashboard;