import React from 'react';
import Viz from '../viz/viz';
import ProjectLandscape from '../viz/projectLandscape/projectLandscape';
import { Dashboard, DashboardRow, DashboardItem } from '../containers/Dashboard';

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <Viz component={ProjectLandscape} />
      </DashboardItem>
      <DashboardItem w={1/2}>
        <Viz component={ProjectLandscape} />
      </DashboardItem>
    </DashboardRow>

    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <Viz component={ProjectLandscape} />
      </DashboardItem>
      <DashboardItem w={1/2}>
        <Viz component={ProjectLandscape} />
      </DashboardItem>
    </DashboardRow>
  </Dashboard>
);
