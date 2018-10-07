import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withUserContext} from "../../../framework/user/userContext";
import {
  DimensionMostActiveChildrenWidget,
  DimensionWeeklyContributorCountWidget
} from "../../shared/widgets/accountHierarchy";

const dashboard_id = 'dashboards.contributors.organization';

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
                dimension={'organization'}
                childDimension={'contributors'}
                instanceKey={context.getInstanceKey('organization')}
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
                dimension={'organization'}
                instanceKey={context.getInstanceKey('organization')}
                childConnection={'recentlyActiveContributors'}
                context={context}
                childContext={Contributors}
                top={10}
                days={7}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow>
        <DashboardWidget
          w={1}
          name="weekly-contributor-count"
          render={
            (view) =>
              <DimensionWeeklyContributorCountWidget
                dimension={'organization'}
                instanceKey={context.getInstanceKey('organization')}
                context={context}
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