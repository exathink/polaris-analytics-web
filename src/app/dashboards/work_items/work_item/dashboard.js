import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {WorkItemDetailsWidget} from "./details/workItemDetailsWidget";

const dashboard_id = 'dashboards.work_items.work_item.instance';


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h={"30%"}>
        <DashboardWidget
                w={1}
                name="details"
                render={
                  () =>
                    <WorkItemDetailsWidget
                      instanceKey={context.getInstanceKey('work_item')}
                    />
                }
              />
      </DashboardRow>
    </Dashboard>
  )
);

export default dashboard;

