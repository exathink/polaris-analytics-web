import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {CommitSummaryWidget} from "../../widgets/activity/ActivitySummary";
import {Contexts} from "../../../meta/contexts";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ChildDimensionActivityProfileWidget} from "../../widgets/activity/ActivityLevel";

const dashboard_id = 'dashboards.activity.projects.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Project Overview'/>
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
              <CommitSummaryWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
              />
          }
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.repositories.display()}>
        <DashboardWidget
          w={1 / 2}
          name="repository-activity-levels"
          render={
            ({view}) =>
              <ChildDimensionActivityProfileWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                childDimension={'repositories'}
                context={context}
                childContext={Contexts.repositories}
                enableDrillDown={false}
                suppressDataLabelsAt={500}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h='22%' title="Something Else">

      </DashboardRow>
      <DashboardRow h='22%' title="Something Else">

      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;

