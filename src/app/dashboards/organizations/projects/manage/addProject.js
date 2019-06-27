import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {OrganizationDashboard} from "../../organizationDashboard";
import {AddProjectWorkflow} from './addProjectWorkflow';
import {withViewerContext} from "../../../../framework/viewer/viewerContext";

const dashboard_id = 'dashboards.add_projects.organization.instance';

export default withViewerContext(
  (
    {
      viewerContext
    }
  ) => (
  <OrganizationDashboard
    pollInterval={60 * 1000}
    render={
      ({organization, context}) => (
        <Dashboard
          dashboard={`${dashboard_id}`}
        >
          <DashboardRow h={"95%"}>
            <DashboardWidget
              w={1}
              render={() => <AddProjectWorkflow organization={organization} viewerContext={viewerContext}/>}
            />
          </DashboardRow>
        </Dashboard>
      )}
  />
))
