import React from 'react';
import {ProjectActivitySummary} from '../components/viz/activitySummary';
import {Dashboard, DashboardItem, DashboardRow} from "./Dashboard/index";

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummary/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummary/>
      </DashboardItem>
    </DashboardRow>

    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummary/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummary/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>
);
