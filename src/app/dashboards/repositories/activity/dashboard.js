import React from "react";
import {FormattedMessage} from "react-intl.macro";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../framework/viz/dashboard";
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget,
  DimensionMostActiveChildrenWidget,
} from "../../shared/widgets/accountHierarchy";
import {RepositoryDashboard} from "../repositoryDashboard";
import {DimensionPullRequestsWidget} from "../../shared/widgets/pullRequests/openPullRequests";
import Contributors from "../../contributors/context";

const dashboard_id = "dashboards.activity.repositories.instance";
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};


export const dashboard = () => (
  <RepositoryDashboard
    pollInterval={60*1000}
    render={
      ({repository, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h='15%'>
            <DashboardWidget
              w={1}
              name="activity-summary"
              title={messages.topRowTitle}
              render={
                () =>
                  <DimensionActivitySummaryPanelWidget
                    dimension={'repository'}
                    instanceKey={repository.key}
                    latestCommit={repository.latestCommit}
                  />
              }
            />
          </DashboardRow>
          <DashboardRow h='30%'>
            <DashboardWidget
                w={1/2}
                name="most-active-contributors"
                render={
                  ({view}) =>
                    <DimensionMostActiveChildrenWidget
                      dimension={'repository'}
                      instanceKey={repository.key}
                      childConnection={'recentlyActiveContributors'}
                      context={context}
                      childContext={Contributors}
                      top={10}
                      latestCommit={repository.latestCommit}
                      days={1}
                      view={view}
                    />
                }
                showDetail={true}
              />
            <DashboardWidget
              name="pull-requests"
              w={1/2}
              render={({ view }) => (
                  <DimensionPullRequestsWidget
                    dimension={'repository'}
                    instanceKey={repository.key}
                    view={view}
                    context={context}
                    latestCommit={repository.latestCommit}
                    asStatistic={false}
                    activeOnly={true}
                    display="histogram"
                    days={30}
                    measurementWindow={30}
                    samplingFrequency={30}
                    latencyTarget={1.4}
                  />
          )}
          showDetail={true}
        />
          </DashboardRow>
          <DashboardRow h={"51%"}>
            <DashboardWidget
              w={1}
              name="commits"
              title={"Contributions"}
              render={
                ({view}) =>
                  <DimensionCommitsNavigatorWidget
                    dimension={'repository'}
                    instanceKey={repository.key}
                    context={context}
                    view={view}
                    days={1}
                    groupBy={'workItem'}
                    groupings={['workItem', 'author', 'branch']}
                    latestCommit={repository.latestCommit}
                    showHeader
                    showTable
                  />
              }
              showDetail={true}
            />
          </DashboardRow>
        </Dashboard>
      )
    }
  />
);
export default dashboard;
