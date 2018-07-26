import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {CommitSummaryWidget} from "../../widgets/activity/ActivitySummary";
import {ChildDimensionActivityProfileWidget} from "../../widgets/activity/ActivityLevel";

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

export const dashboard = withUserContext(withNavigationContext((props) => {
  const accountKey = props.account.account_key;

  return (
    <Dashboard dashboard={`${dashboard_id}`}  {...props}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          title={messages.topRowTitle}
          render={() => <CommitSummaryWidget dimension={'account'} instanceKey={accountKey}/>}
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
                context={props.context}
                childContext={Organizations}
                enableDrillDown={true}
                view={view}
              />}
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
                context={props.context}
                childContext={Projects}
                enableDrillDown={true}
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
                context={props.context}
                enableDrillDown={true}
                suppressDataLabelsAt={500}
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