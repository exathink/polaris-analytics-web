import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {OrganizationDashboard} from "../../organizationDashboard";
import {AddRepositoryWorkflow} from './addRepositoryWorkflow';
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import styles from "../../../../framework/viz/dashboard/dashboardItem.module.css";
const dashboard_id = 'dashboards.add_projects.organization.instance';

export default withViewerContext(
  (
    {
      viewerContext
    }
  ) => (
  <OrganizationDashboard
    render={
      ({organization, context, refresh}) => (
        <Dashboard
          dashboard={`${dashboard_id}`}
        >
          <DashboardRow h={"100%"}>
            <DashboardWidget
              w={1}
              className={styles.dashboardItem}
              render={
                () =>
                  <AddRepositoryWorkflow
                    organization={organization}
                    viewerContext={viewerContext}
                    onDone={
                      () => {
                        refresh();
                        context.go('..', 'repositories')
                      }
                    }
                  />
              }
            />
          </DashboardRow>
        </Dashboard>
      )}
  />
))
