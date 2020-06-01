import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.work_items.work_item.instance';


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"15%"}>
        <div>Work Item details go here</div>
      </DashboardRow>
    </Dashboard>
  )
);

export default dashboard;

