import React from 'react';
import { Dashboard } from './Dashboard/index';
import { DashboardRow } from './Dashboard/row';
import {DashboardItem} from './Dashboard/item';
import {ProjectActivitySummaryViz} from '../components/viz/activitySummary';

export default (props) => (
  <Dashboard>
    <DashboardRow h='30%'>
      <DashboardItem w={1/3}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
      <DashboardItem w={2/3}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
    <DashboardRow h='30%'>
        <DashboardItem w={1/2}>
          <ProjectActivitySummaryViz/>
        </DashboardItem>
        <DashboardItem w={1/2}>
          <ProjectActivitySummaryViz/>
        </DashboardItem>
      </DashboardRow>
    <DashboardRow h='40%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
