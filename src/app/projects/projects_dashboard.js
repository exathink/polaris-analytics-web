import React from 'react';
import { Dashboard, DashboardRow, DashboardItem} from '../../containers/Dashboard/index';
import {RepositoryActivitySummaryViz} from './viz/repositoryActivitySummaryViz';
export const dashboard = ({match, ...rest}) => (
  <Dashboard {...rest}>
    <DashboardRow h='40%'>
      <DashboardItem name="repositories-activity" w={1}>
        <RepositoryActivitySummaryViz/>
      </DashboardItem>
    </DashboardRow>
  </Dashboard>

);
export default dashboard;