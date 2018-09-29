import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionActivitySummaryPanelWidget} from "../../shared/views/activitySummary";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ContributorActivitySummaryWidget} from "../widgets/activitySummaryWidget";
import {DimensionCommitsNavigatorWidget} from "../../shared/widgets/accountHierarchy";

const dashboard_id = 'dashboards.activity.contributors.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Contributor Overview'/>
};


export const dashboard = withNavigationContext(({match, context, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`} {...rest}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          name="activity-summary"
          title={messages.topRowTitle}
          render={
            () =>
              <ContributorActivitySummaryWidget
                instanceKey={context.getInstanceKey('contributor')}
              />
          }
        />
      </DashboardRow>
      <DashboardRow h='63%'>
        <DashboardWidget
          w={1}
          name="commits"
          render={
            ({view}) =>
              <DimensionCommitsNavigatorWidget
                dimension={'contributor'}
                instanceKey={context.getInstanceKey('contributor')}
                context={context}
                view={view}
                days={30}
                groupBy={'repository'}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;

