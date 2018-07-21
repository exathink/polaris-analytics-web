import React from 'react';
import {FormattedMessage} from 'react-intl';
import { Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {ActivityProfileWidget} from "../../widgets/activity/ActivityLevel";
import {ActivitySummaryWidget} from "../../widgets/activity/ActivitySummary";
import {AccountCommitSummaryWidget} from "./widgets/accountCommitSummaryWidget";
import {Contexts} from "../../../meta/contexts";
import Organizations from "../../organizations/context";
import Projects from "../../projects/context";

import {DataSources} from "./dataSources";

const dashboard_id = 'dashboards.activity.account';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Account Overview'/>
};

export const dashboard = (props) => (
  <Dashboard dashboard={`${dashboard_id}`}  {...props}>
    <DashboardRow h='15%'>
      <DashboardWidget
        w={1}
        title={messages.topRowTitle}
        primary={AccountCommitSummaryWidget}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.organizations.display()}>
      <ActivityProfileWidget
        w={1/2}
        name="organization-activity-profile"
        childContext={Organizations}
        enableDrillDown={true}
        dataBinding={() => ({
          dataSource: DataSources.activity_level_for_account_by_organization,
          params: {}
        })}
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
);
export default dashboard;