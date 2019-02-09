import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";
import {RepositoryDashboard} from "../repositoryDashboard";
import {getTimelineRefreshInterval} from "../../shared/helpers/commitUtils";

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
                  />
              }
            />
          </DashboardRow>
          <DashboardRow h={"90%"}>
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
                    groupings={['author', 'workItem']}
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

