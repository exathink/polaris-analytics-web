import React from 'react';
import {ProjectActivitySummaryRecharts} from '../components/viz/activitySummary';
import Dashboard from './Dashboard';
import DashboardRow from './Dashboard/row';
import DashboardItem from './Dashboard/item';

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryRecharts/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryRecharts/>
      </DashboardItem>
    </DashboardRow>

    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryRecharts/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryRecharts/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>
);
