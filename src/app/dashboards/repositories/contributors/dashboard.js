import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withUserContext} from "../../../framework/user/userContext";
import {
  DimensionCommitsNavigatorWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";

const dashboard_id = 'dashboards.contributors.repository';

export const dashboard = withUserContext(withNavigationContext(
  ({account, context}) => {


  return (
    <Dashboard dashboard={`${dashboard_id}`}>

      <DashboardRow h='22%' title={Contexts.contributors.display()}>
        <DashboardWidget
          w={1 / 2}
          name="contributors-activity-profile"
          render={
            ({view}) =>
              <DimensionContributorActivityProfileWidget
                dimension={'repository'}
                childDimension={'contributors'}
                instanceKey={context.getInstanceKey('repository')}
                context={context}
                childContext={Contributors}
                enableDrillDown={true}
                suppressDataLabelsAt={500}
                view={view}
                pageSize={50}
              />}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 2}
          name="most-active-contributors"
          render={
            ({view}) =>
              <DimensionMostActiveChildrenWidget
                dimension={'repository'}
                instanceKey={context.getInstanceKey('repository')}
                childConnection={'recentlyActiveContributors'}
                context={context}
                childContext={Contributors}
                top={10}
                days={1}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
}));
export default dashboard;