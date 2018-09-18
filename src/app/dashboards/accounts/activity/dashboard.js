import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionActivitySummaryPanelWidget, DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Organizations from "../../organizations/context";
import Projects from "../../projects/context";
import Repositories from "../../repositories/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withUserContext} from "../../../framework/user/userContext";

const dashboard_id = 'dashboards.activity.account';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Account Overview'/>
};

export const dashboard = withUserContext(withNavigationContext(
  ({account, context}) => {
  const accountKey = account.account_key;

  return (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          title={messages.topRowTitle}
          render={() => <DimensionActivitySummaryPanelWidget dimension={'account'} instanceKey={accountKey}/>}
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.organizations.display()}>
        <DashboardWidget
          w={1 / 2}
          name="organizations-activity-profile"
          render={
            ({view}) =>
              <ChildDimensionActivityProfileWidget
                dimension={'account'}
                childDimension={'organizations'}
                instanceKey={accountKey}
                context={context}
                childContext={Organizations}
                enableDrillDown={true}
                view={view}
              />}
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 2}
          name="most-active-organizations"
          render={
            ({view}) =>
              <DimensionMostActiveChildrenWidget
                dimension={'account'}
                instanceKey={accountKey}
                childConnection={'recentlyActiveOrganizations'}
                context={context}
                childContext={Organizations}
                top={5}
                days={7}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.projects.display()}>
        <DashboardWidget
          w={1 / 2}
          name="projects-activity-profile"
          render={
            ({view}) =>
              <ChildDimensionActivityProfileWidget
                dimension={'account'}
                childDimension={'projects'}
                instanceKey={accountKey}
                context={context}
                childContext={Projects}
                enableDrillDown={true}
                view={view}
                pageSize={50}
              />
          }
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 2}
          name="most-active-projects"
          render={
            ({view}) =>
              <DimensionMostActiveChildrenWidget
                dimension={'account'}
                instanceKey={accountKey}
                childConnection={'recentlyActiveProjects'}
                context={context}
                childContext={Projects}
                top={5}
                days={7}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.repositories.display()}>
        <DashboardWidget
          w={1 / 2}
          name="repositories-activity-profile"
          render={
            ({view}) =>
              <ChildDimensionActivityProfileWidget
                dimension={'account'}
                childDimension={'repositories'}
                instanceKey={accountKey}
                childContext={Repositories}
                context={context}
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
                dimension={'account'}
                instanceKey={accountKey}
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
    </Dashboard>
  )
}));
export default dashboard;