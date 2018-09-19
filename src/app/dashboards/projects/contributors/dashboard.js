import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionActivitySummaryPanelWidget} from "../../shared/views/activitySummary";
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withUserContext} from "../../../framework/user/userContext";
import {
  DimensionCumulativeCommitCountWidget,
  DimensionMostActiveChildrenWidget, DimensionWeeklyContributorCountWidget
} from "../../shared/widgets/accountHierarchy";

const dashboard_id = 'dashboards.contributors.project';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Contributors Overview'/>
};

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
                dimension={'project'}
                childDimension={'contributors'}
                instanceKey={context.getInstanceKey('project')}
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
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                childConnection={'recentlyActiveContributors'}
                context={context}
                childContext={Contributors}
                top={10}
                days={30}
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
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
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