import React from 'react';
import {ProjectActivitySummaryViz} from '../components/viz/activitySummary';
import {Dashboard, DashboardItem, DashboardRow} from "./Dashboard/index";

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
    <DashboardRow h='50%'>
        <DashboardItem w={1/2}>
          <ProjectActivitySummaryViz/>
        </DashboardItem>
        <DashboardItem w={1/2}>
          <ProjectActivitySummaryViz/>
        </DashboardItem>
      </DashboardRow>
  </Dashboard>
);
