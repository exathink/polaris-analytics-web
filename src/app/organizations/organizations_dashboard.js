import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../containers/Dashboard/index';
import {ProjectActivitySummaryViz} from './viz/projectActivitySummaryViz';
export const dashboard = ({match, ...rest}) => (
  <Dashboard {...rest}>
    <DashboardRow h='40%'>
      <DashboardItem name="projects-activity" w={1}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;