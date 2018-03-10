import React from 'react';
import ProjectLandscape from '../viz/projectLandscape/projectLandscapePlotly';
import {Dashboard, DashboardItem, DashboardRow} from "./Dashboard/index";

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectLandscape />
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectLandscape/>
      </DashboardItem>
    </DashboardRow>

    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <ProjectLandscape/>
      </DashboardItem>
      <DashboardItem w={1/2}>
        <ProjectLandscape/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>
);
