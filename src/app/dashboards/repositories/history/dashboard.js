import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionCommitHistoryWidget,
  DimensionWeeklyContributorCountWidget
} from "../../shared/widgets/accountHierarchy";
import {RepositoryDashboard} from "../repositoryDashboard";

const dashboard_id = 'dashboards.history.repositories.instance';

export const dashboard = () => (
  <RepositoryDashboard
    pollInterval={60*1000}
    render={
      ({repository, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h={"100%"}>
            <DashboardWidget
              w={1 / 2}
              name="cumulative-commit-count"
              render={
                ({view}) =>
                  <DimensionCommitHistoryWidget
                    dimension={'repository'}
                    instanceKey={repository.key}
                    context={context}
                    view={view}
                    detailViewGroupings={['author','workItem']}
                    detailViewCommitsGroupBy={'author'}
                    referenceDate={repository.latestCommit}
                  />
              }
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 2}
              name="weekly-contributor-count"
              render={
                ({view}) =>
                  <DimensionWeeklyContributorCountWidget
                    dimension={'repository'}
                    instanceKey={repository.key}
                    context={context}
                    view={view}
                    referenceDate={repository.latestCommit}
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

