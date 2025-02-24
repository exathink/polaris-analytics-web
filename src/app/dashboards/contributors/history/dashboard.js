import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionCommitHistoryWidget} from "../../shared/widgets/accountHierarchy";
import {ContributorDashboard} from "../contributorDashboard";

const dashboard_id = 'dashboards.history.contributors.instance';


export const dashboard = ()=> (
  <ContributorDashboard
    pollInterval={60*1000}
    render={
      ({contributor, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h={"100%"}>
            <DashboardWidget
              w={1}
              name="cumulative-commit-count"
              render={
                ({view}) =>
                  <DimensionCommitHistoryWidget
                    dimension={'contributor'}
                    instanceKey={contributor.key}
                    context={context}
                    view={view}
                    detailViewGroupings={['workItem', 'repository']}
                    detailViewCommitsGroupBy={'workItem'}
                    referenceDate={contributor.latestCommit}
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

