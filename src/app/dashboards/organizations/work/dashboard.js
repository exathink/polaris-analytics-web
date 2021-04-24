import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionWorkItemEventsNavigatorWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";
import {OrganizationDashboard} from '../organizationDashboard';
import Projects from "../../projects/context";
import Repositories from "../../repositories/context";
import Contributors from "../../contributors/context";

const dashboard_id = 'dashboards.work.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};


export const dashboard = () => (
  <OrganizationDashboard
    pollInterval={60*1000}
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
                    />
              }
            />
          </DashboardRow>
          <DashboardRow h={"22%"}>
            <DashboardWidget
              w={organization.projectCount > 0 ? 1 / 3 : 1/2}
              name="most-active-repositories"
              render={
                ({view}) =>
                  <DimensionMostActiveChildrenWidget
                    dimension={'organization'}
                    instanceKey={organization.key}
                    childConnection={'recentlyActiveRepositories'}
                    context={context}
                    childContext={Repositories}
                    top={10}
                    latestCommit={organization.latestCommit}
                    days={1}
                    view={view}
                  />
              }
              showDetail={true}
            />
            <DashboardWidget
              w={organization.projectCount > 0 ? 1 / 3 : 1/2}
              name="most-active-contributors"
              render={
                ({view}) =>
                  <DimensionMostActiveChildrenWidget
                    dimension={'organization'}
                    instanceKey={organization.key}
                    childConnection={'recentlyActiveContributors'}
                    context={context}
                    childContext={Contributors}
                    top={10}
                    latestCommit={organization.latestCommit}
                    days={1}
                    view={view}
                  />
              }
              showDetail={true}
            />
            {
              organization.projectCount > 0 ?
                <DashboardWidget
                  w={1 / 3}
                  name="most-active-projects"
                  render={
                    ({view}) =>
                      <DimensionMostActiveChildrenWidget
                        dimension={'organization'}
                        instanceKey={organization.key}
                        childConnection={'recentlyActiveProjects'}
                        context={context}
                        childContext={Projects}
                        top={10}
                        latestCommit={organization.latestCommit}
                        days={1}
                        view={view}
                      />
                  }
                  showDetail={true}
                />
                :
                null
            }
          </DashboardRow>
          <DashboardRow h={"59%"}>
            <DashboardWidget
              w={1}
              name="workItemEvents"
              render={
                ({view}) =>
                  <DimensionWorkItemEventsNavigatorWidget
                    dimension={'organization'}
                    instanceKey={organization.key}
                    context={context}
                    view={view}
                    days={1}
                    latestCommit={organization.latestCommit}
                    latestWorkItemEvent={organization.latestWorkItemEvent}
                    markLatest
                    groupBy={'workItem'}
                    groupings={['workItem', 'event', 'source', 'type']}
                    showHeader={true}

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