import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {ActivityProfileWidget} from "../../widgets/activity/ActivityLevel";
import {AccountCommitSummaryWidget} from "./widgets/accountCommitSummaryWidget";
import {Contexts} from "../../../meta/contexts";
import Organizations from "../../organizations/context";
import Projects from "../../projects/context";

import {DataSources} from "./dataSources";
import {AccountOrganizationsActivityWidget} from "./widgets/accountOrganizationsActivityWidget";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.activity.account';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Account Overview'/>
};

export const dashboard = withNavigationContext((props) => (
  <Dashboard dashboard={`${dashboard_id}`}  {...props}>
    <DashboardRow h='15%'>
      <DashboardWidget
        w={1}
        title={messages.topRowTitle}
        primary={AccountCommitSummaryWidget}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.organizations.display()}>
      <DashboardWidget
        w={1/2}
        name="organization-activity-profile"
        context={props.context}
        childContext={Organizations}
        enableDrillDown={true}
        primary={(props) => <AccountOrganizationsActivityWidget view={'summary'} {...props}/>}
        detail={(props) => <AccountOrganizationsActivityWidget view={'detail'} {...props} />}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.projects.display()}>
      <ActivityProfileWidget
        w={1/2}
        name="project-activity-profile"
        childContext={Projects}
        enableDrillDown={true}
        dataBinding={() => ({
          dataSource: DataSources.activity_level_for_account_by_project,
          params: {}
        })}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>
      <ActivityProfileWidget
        w={1/2}
        name="repository-activity-profile"
        childContext={Contexts.repositories}
        enableDrillDown={false}
        suppressDataLabelsAt={500}
        dataBinding={() => ({
          dataSource: DataSources.activity_level_for_account_by_repository,
          params: {}
        })}
      />
    </DashboardRow>
  </Dashboard>
));
export default dashboard;