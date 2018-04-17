import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../Dashboard/index';
import {ProjectActivitySummaryViz} from '../../viz/organizations/projectActivitySummaryViz';
export const dashboard = ({match, ...rest}) => (
  <Dashboard {...rest}>
    <DashboardRow h='40%'>
      <DashboardItem name="organization-projects-activity-summary" w={1}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;