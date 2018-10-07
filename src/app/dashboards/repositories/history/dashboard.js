import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget,
  DimensionCommitHistoryWidget, DimensionWeeklyContributorCountWidget
} from "../../shared/widgets/accountHierarchy";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.history.repositories.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Repository History'/>
};


export const dashboard = withNavigationContext(({match, context, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`} {...rest}>
      <DashboardRow h={"100%"}>
        <DashboardWidget
          w={1/2}
          name="cumulative-commit-count"
          render={
            ({view}) =>
              <DimensionCommitHistoryWidget
                dimension={'repository'}
                instanceKey={context.getInstanceKey('repository')}
                context={context}
                view={view}
              />
          }
          showDetail={true}
        />
        <DashboardWidget
          w={1/2}
          name="weekly-contributor-count"
          render={
            ({view}) =>
              <DimensionWeeklyContributorCountWidget
                dimension={'repository'}
                instanceKey={context.getInstanceKey('repository')}
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

