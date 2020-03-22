import React from 'react';
import {FormattedMessage} from 'react-intl';
import {
  Dashboard,
  DashboardRow,
  DashboardTabPane,
  DashboardTabs,
  DashboardWidget
} from '../../../framework/viz/dashboard';

import {ProjectActivitySummaryWidget} from "./activitySummary";
import {ProjectWorkItemSummaryWidget} from "./workItemSummary";
import {ProjectCycleMetricsWidget} from "./cycleMetrics";

import {
  DimensionCommitsNavigatorWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";

import {ProjectDashboard} from "../projectDashboard";
import Contributors from "../../contributors/context";

const dashboard_id = 'dashboards.activity.projects.newDashboard.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};


export const dashboard = () => (
  <ProjectDashboard
    pollInterval={1000 * 60}
    render={
      ({
         project: {
           key,
           latestWorkItemEvent,
           latestCommit
         },
         context
      }) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h='15%'>
            <DashboardWidget
              w={0.2}
              name="activity-summary"
              title={messages.topRowTitle}
              render={
                () =>
                  <ProjectActivitySummaryWidget
                    instanceKey={key}
                  />
              }
            />
            <DashboardWidget
              w={0.30}
              name="workitem-summary"
              title={"Pipeline"}
              render={
                () =>
                  <ProjectWorkItemSummaryWidget
                    instanceKey={key}
                    latestWorkItemEvent={latestWorkItemEvent}
                  />
              }
              showDetail={true}
            />
            <DashboardWidget
              w={0.25}
              name="cycle-metrics"
              title={"Cycle Metrics"}
              subtitle={"Last 30 Days"}
              render={
                () =>
                  <ProjectCycleMetricsWidget
                    instanceKey={key}
                    latestWorkItemEvent={latestWorkItemEvent}
                    days={30}
                    targetPercentile={0.70}
                  />
              }
              showDetail={true}
            />

          </DashboardRow>
          <DashboardRow h='81%'>
            <DashboardTabs
              defaultActiveKey={'development'}
            >
              <DashboardTabPane tab={'Active'} key={'development'}>
                <DashboardRow h={'25%'}>
                  <DashboardWidget
                    w={1/3}
                    render={() => null}
                  />
                  <DashboardWidget
                    w={1/3}
                    render={() => null}
                  />
                  <DashboardWidget
                    w={1 / 3}
                    name="most-active-contributors"
                    render={
                      ({view}) =>
                        <DimensionMostActiveChildrenWidget
                          dimension={'project'}
                          instanceKey={key}
                          childConnection={'recentlyActiveContributors'}
                          context={context}
                          childContext={Contributors}
                          top={10}
                          latestCommit={latestCommit}
                          days={1}
                          view={view}
                        />
                    }
                    showDetail={true}
                  />
                </DashboardRow>
                <DashboardRow h={'75%'}>
                  <DashboardWidget
                    w={1}
                    name="commits"
                    title={"Code Changes"}
                    render={
                      ({view}) =>
                        <DimensionCommitsNavigatorWidget
                          dimension={'project'}
                          instanceKey={key}
                          context={context}
                          view={view}
                          days={1}
                          latestCommit={latestCommit}
                          latestWorkItemEvent={latestWorkItemEvent}
                          groupBy={'workItem'}
                          groupings={['workItem', 'author', 'repository', 'branch']}
                          showHeader
                          showTable
                        />
                    }
                    showDetail={true}
                  />
                </DashboardRow>
              </DashboardTabPane>
              <DashboardTabPane tab={'Watchlist'} key={'watchlist'}>

              </DashboardTabPane>
              <DashboardTabPane tab={'Code Complete'} key={'code-complete'}>

              </DashboardTabPane>
              <DashboardTabPane tab={'Closed'} key={'closed'}>

              </DashboardTabPane>
            </DashboardTabs>
          </DashboardRow>
        </Dashboard>
      )
    }
  />
);
export default dashboard;
