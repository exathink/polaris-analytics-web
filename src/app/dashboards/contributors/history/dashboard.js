import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionCommitHistoryWidget} from "../../shared/widgets/accountHierarchy";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.history.contributors.instance';


export const dashboard = withNavigationContext(({match, context, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`} {...rest}>
      <DashboardRow h={"100%"}>
        <DashboardWidget
          w={1}
          name="cumulative-commit-count"
          render={
            ({view}) =>
              <DimensionCommitHistoryWidget
                dimension={'contributor'}
                instanceKey={context.getInstanceKey('contributor')}
                context={context}
                view={view}
                detailViewCommitsGroupBy={'repository'}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;

