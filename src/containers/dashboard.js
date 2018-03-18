import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from './Dashboard/index';
import {ProjectActivitySummaryViz} from '../components/viz/activitySummary';


export const dashboard = (props) => (
  <Dashboard {...props}>
    <DashboardRow h='30%'>
      <DashboardItem name="item1" w={1/3}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
      <DashboardItem name="item2" w={2/3}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
    <DashboardRow h='30%'>
        <DashboardItem name="item3" w={1/2}>
          <ProjectActivitySummaryViz/>
        </DashboardItem>
        <DashboardItem name="item4" w={1/2}>
          <ProjectActivitySummaryViz/>
        </DashboardItem>
      </DashboardRow>
    <DashboardRow h='40%'>
      <DashboardItem name="item5" w={1/2}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
      <DashboardItem name="item6" w={1/2}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;