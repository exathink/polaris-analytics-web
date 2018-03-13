import React from 'react';
import {ProjectActivitySummaryHighcharts} from '../components/viz/activitySummary';
import {Dashboard, DashboardItem, DashboardRow} from "./Dashboard/index";

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryHighcharts/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryHighcharts/>
      </DashboardItem>
    </DashboardRow>
    <DashboardRow h='50%'>
        <DashboardItem w={1/2}>
          <ProjectActivitySummaryHighcharts/>
        </DashboardItem>
        <DashboardItem w={1/2}>
          <ProjectActivitySummaryHighcharts/>
        </DashboardItem>
      </DashboardRow>
  </Dashboard>
);
