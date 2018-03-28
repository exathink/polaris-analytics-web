import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from './Dashboard/index';
import {ProjectActivitySummaryViz} from '../viz/projects/activitySummaryViz';


export const dashboard = (props) => (
  <Dashboard {...props}>
    <DashboardRow h='40%'>
      <DashboardItem name="project-activity" w={1}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;