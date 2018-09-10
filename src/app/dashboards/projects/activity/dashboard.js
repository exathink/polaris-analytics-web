import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";
import {Contexts} from "../../../meta/contexts";
import Repositories from "../../repositories/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";

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
                childContext={Repositories}
                enableDrillDown={true}
                suppressDataLabelsAt={500}
                view={view}
                pageSize={50}
              />
          }
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 2}
          name="most-active-repositories"
          render={
            ({view}) =>
              <DimensionMostActiveChildrenWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                childConnection={'recentlyActiveRepositories'}
                context={context}
                childContext={Repositories}
                top={5}
                days={7}
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

