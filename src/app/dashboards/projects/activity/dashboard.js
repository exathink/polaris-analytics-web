import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.activity.projects.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Project Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          name="activity-summary"
          title={messages.topRowTitle}
          render={
            () =>
              <DimensionActivitySummaryPanelWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
              />
          }
        />
      </DashboardRow>
      <DashboardRow h='90%'>
        <DashboardWidget
          w={1}
          name="commits"
          render={
            ({view}) =>
              <DimensionCommitsNavigatorWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                context={context}
                view={view}
                days={1}
                groupBy={'repository'}
                pollInterval={60*1000}
                showHeader
                showTable
              />
          }
          showDetail={true}
        />
      </DashboardRow>

    </Dashboard>
  )
);
export default dashboard;

