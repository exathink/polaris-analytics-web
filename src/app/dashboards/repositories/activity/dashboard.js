import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionActivitySummaryPanelWidget, DimensionCumulativeCommitCountWidget} from "../../shared/widgets/accountHierarchy";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.activity.repositories.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Repository Overview'/>
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
              <DimensionActivitySummaryPanelWidget
                dimension={'repository'}
                instanceKey={context.getInstanceKey('repository')}
              />
          }
        />
      </DashboardRow>
      <DashboardRow h='44%' title="Commit History">
        <DashboardWidget
          w={1/2}
          name="cumulative-commit-count"
          render={
            (view) =>
              <DimensionCumulativeCommitCountWidget
                dimension={'repository'}
                instanceKey={context.getInstanceKey('repository')}
                context={context}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h='22%' title="Something Else">

      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;

