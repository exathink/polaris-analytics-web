import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ProjectActivitySummaryViz} from './viz/projectActivitySummaryViz';
export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard='organizations-dashboard' {...rest}>
    <DashboardRow h='40%'>
      <DashboardItem name="projects-activity" w={1}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;