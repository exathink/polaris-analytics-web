import React from 'react';
import {FormattedMessage} from 'react-intl.macro';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";
import {RepositoryDashboard} from "../repositoryDashboard";

const dashboard_id = 'dashboards.activity.repositories.instance';
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
          <DashboardRow h={"81%"}>
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
