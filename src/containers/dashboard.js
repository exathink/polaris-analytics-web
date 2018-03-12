import React from 'react';
import {ActivitySummaryHighcharts} from '../components/viz/activitySummary/activitySummaryHighcharts';
import {ProjectActivitySummaryRecharts} from '../components/viz/activitySummary';
import {Dashboard, DashboardItem, DashboardRow} from "./Dashboard/index";

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ActivitySummaryHighcharts/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ActivitySummaryHighcharts/>
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
