import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {WorkItemDetailsWidget} from "./details/workItemDetailsWidget";

import {WorkItemStateView} from "./views/workItemStateView";

import {WorkItemDashboard} from "../workItemDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";

const dashboard_id = 'dashboards.work_items.work_item.instance';


export const dashboard =
  ({viewerContext}) => (
    <WorkItemDashboard
      pollInterval={1000 * 60}
      render={
        ({
           workItem,
           context
         }) => {
          return (
            <Dashboard dashboard={`${dashboard_id}`}>
              <DashboardRow h={'5%'}>
                <DashboardWidget
                  w={1}
                  name="name"
                  render={
                    () =>
                      <h2 style={{color: "#6c6c6c"}}>
                        {`${workItem.displayId}: ${workItem.name}`}
                      </h2>
                  }
                />
              </DashboardRow>
              <DashboardRow
                h={"15%"}
              >
                <DashboardWidget
                  w={1/2}
                  name="details"
                  render={
                    ({view}) =>
                      <WorkItemStateView
                        workItem={workItem}
                        view={view}
                      />
                  }
                />
              </DashboardRow>
            </Dashboard>
          )
        }
      }

    />
  );

export default withViewerContext(dashboard);

