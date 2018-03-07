import React from 'react';
import PlotViz from '../viz/plotly-viz';
import ProjectLandscapePlotly from '../viz/projectLandscape/projectLandscapePlotly';
import { Dashboard, DashboardRow, DashboardItem } from '../containers/Dashboard';

export default (props) => (
  <Dashboard>
    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <PlotViz component={ProjectLandscapePlotly} />
      </DashboardItem>
      <DashboardItem w={1/2}>
        <PlotViz component={ProjectLandscapePlotly} />
      </DashboardItem>
    </DashboardRow>

    <DashboardRow h='50%'>
      <DashboardItem w={1/2}>
        <PlotViz component={ProjectLandscapePlotly} />
      </DashboardItem>
      <DashboardItem w={1/2}>
        <PlotViz component={ProjectLandscapePlotly} />
      </DashboardItem>
    </DashboardRow>
  </Dashboard>
);
