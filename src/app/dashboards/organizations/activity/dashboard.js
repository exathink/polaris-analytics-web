import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
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
                dimension={'organization'}
                instanceKey={context.getInstanceKey('organization')}
                pollInterval={60*1000}
              />}
        />
      </DashboardRow>
      <DashboardRow h='90%'>
        <DashboardWidget
          w={1}
          name="commits"
          render={
            ({view}) =>
              <DimensionCommitsNavigatorWidget
                dimension={'organization'}
                instanceKey={context.getInstanceKey('organization')}
                context={context}
                view={view}
                days={1}
                groupBy={'repository'}
                pollInterval={60*1000}
              />
          }
          showDetail={true}
        />
      </DashboardRow>

    </Dashboard>
  )
);
export default dashboard;