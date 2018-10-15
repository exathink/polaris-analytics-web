import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";
import {OrganizationDashboard} from '../organizationDashboard';
import {getTimelineRefreshInterval} from "../../shared/helpers/commitUtils";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};







export const dashboard = () => (
    <OrganizationDashboard
      render={
        ({organization, context}) =>
          <Dashboard
            dashboard={`${dashboard_id}`}
          >
            <DashboardRow h='15%'>
              <DashboardWidget
                w={1}
                name="activity-summary"
                title={messages.topRowTitle}
                render={
                  () =>
                    <DimensionActivitySummaryPanelWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      pollInterval={getTimelineRefreshInterval(organization.latestCommit)}
                    />}
              />
            </DashboardRow>
            <DashboardRow h='90%'>
              <DashboardWidget
                w={1}
                name="commits"
                render={
                  ({view}) =>
                    <DimensionCommitsNavigatorWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      context={context}
                      view={view}
                      latest={50}
                      groupBy={'repository'}
                      pollInterval={getTimelineRefreshInterval(organization.latestCommit)}
                      showHeader
                      showTable
                    />
                }
                showDetail={true}
              />
            </DashboardRow>
          </Dashboard>
        }
      />
);
export default dashboard;