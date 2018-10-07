import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionCommitHistoryWidget,
  DimensionWeeklyContributorCountWidget
} from "../../shared/widgets/accountHierarchy";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.history.projects.instance';


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h='100%'>
        <DashboardWidget
          w={1/2}
          name="cumulative-commit-count"
          render={
            ({view}) =>
              <DimensionCommitHistoryWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                context={context}
                view={view}
                detailViewCommitsGroupBy={'repository'}
              />
          }
          showDetail={true}
        />
        <DashboardWidget
          w={1/2}
          name="weekly-contributor-count"
          render={
            (view) =>
              <DimensionWeeklyContributorCountWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                context={context}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>

    </Dashboard>
  )
);
export default dashboard;

