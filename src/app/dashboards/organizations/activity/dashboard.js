import React from 'react';
import {FormattedMessage} from 'react-intl.macro';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";
import {OrganizationDashboard} from '../organizationDashboard';
import Projects from "../../projects/context";
import Repositories from "../../repositories/context";
import Contributors from "../../contributors/context";
import {ActivityDashboardSetup} from "./setup";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {SYSTEM_TEAMS} from "../../../../config/featureFlags";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};


export const dashboard = ({viewerContext}) => {
  const teamsActive = viewerContext.isFeatureFlagActive(SYSTEM_TEAMS)
  return (
    <OrganizationDashboard
    pollInterval={60 * 1000}
    render={
      ({organization, context}) =>
        organization.repositoryCount > 0 ?
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
                      latestCommit={organization.latestCommit}
                    />
                }
              />
            </DashboardRow>
            <DashboardRow h={"22%"}>
              {
                organization.projectCount > 0 ?
                  <DashboardWidget
                    w={1 / 2}
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
              <DashboardWidget
                w={1/2}
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
            </DashboardRow>
            <DashboardRow h={"59%"}>
              <DashboardWidget
                w={1}
                name="commits"
                title={"Contributions"}
                render={
                  ({view}) =>
                    <DimensionCommitsNavigatorWidget
                      dimension={'organization'}
                      instanceKey={organization.key}
                      context={context}
                      view={view}
                      days={1}
                      latestCommit={organization.latestCommit}
                      latestWorkItemEvent={organization.latestWorkItemEvent}
                      markLatest
                      groupBy={'workItem'}
                      groupings={
                        teamsActive ?
                          ['workItem', 'team', 'repository','branch'] :
                          ['workItem', 'repository','branch']
                      }
                      showHeader
                      showTable
                    />
                }
                showDetail={true}
              />
            </DashboardRow>
          </Dashboard>
          :
          <ActivityDashboardSetup organization={organization} context={context}/>
    }
  />
)};
export default withViewerContext(dashboard);
