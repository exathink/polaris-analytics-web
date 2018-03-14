import React from 'react';
import Dashboard from './Dashboard/index';
import DashboardRow from './Dashboard/row';
import DashboardItem from './Dashboard/item';
import {ProjectActivitySummaryViz} from '../components/viz/activitySummary';
import uniqid from 'uniqid';

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryViz id={uniqid('viz-')} />
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectActivitySummaryViz id={uniqid('viz-')} />
      </DashboardItem>
    </DashboardRow>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
          <ProjectActivitySummaryViz id={uniqid('viz-')} />
        </DashboardItem>
      <DashboardItem w={1/2}>
          <ProjectActivitySummaryViz id={uniqid('viz-')} />
        </DashboardItem>
      </DashboardRow>
  </Dashboard>
);
