import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";
import {WithOrganization} from '../withOrganization';

import ProjectsTopic from "../projects/topic";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};


export const dashboard = withNavigationContext(
  ({context, filterTopics}) => (
    <WithOrganization
      organizationKey={context.getInstanceKey('organization')}
      render={
        ({organization}) =>
          <Dashboard
            dashboard={`${dashboard_id}`}
            onDashboardMounted={
              () => organization.projects.count === 0 ? filterTopics([ProjectsTopic.name]) : null
            }
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
                      instanceKey={context.getInstanceKey('organization')}
                      //pollInterval={60*1000}
                    />}
              />
            </DashboardRow>
            <DashboardRow h='85%'>
              <DashboardWidget
                w={1}
                name="commits"
                render={
                  ({view}) =>
                    <DimensionCommitsNavigatorWidget
                      dimension={'organization'}
                      instanceKey={context.getInstanceKey('organization')}
                      context={context}
                      view={view}
                      days={1}
                      groupBy={'repository'}
                      markLatest
                      //pollInterval={60*1000}
                      showHeader
                      showTable
                    />
                }
                showDetail={true}
              />
            </DashboardRow>

          </Dashboard>
      }/>
  )
);
export default dashboard;