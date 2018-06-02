import React from 'react';
import {FormattedMessage} from 'react-intl';
import { Dashboard, DashboardRow, DashboardItem} from '../../../framework/viz/dashboard/index';
import {ActivityLevelDetailView, ActivityLevelSummaryView} from "../../../views/activity/ActivityLevel";
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";
import {Contexts} from "../../../meta/contexts";
import {DataSources} from "./dataSources";



const dashboard_id = 'dashboards.activity.account';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Account Overview'/>
};

export const dashboard = (props) => (
  <Dashboard dashboard={`${dashboard_id}`}  {...props}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title={messages.topRowTitle}
        primary={ActivitySummaryViz}
        dataBinding={()=>({
          dataSource: DataSources.activity_summary_for_account,
          params: {}
        })}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.organizations.display()}>
      <DashboardItem
        w={1/2}
        name="org-activity-levels"
        childContext={Contexts.organizations}
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
        dataBinding={() => ({
          dataSource: DataSources.activity_level_for_account_by_organization,
          params: {}
        })}
        enableDrillDown={true}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.projects.display()}>
      <DashboardItem
        w={1/2}
        name="prj-activity-levels"
        childContext={Contexts.projects}
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
        dataBinding={() => ({
          dataSource: DataSources.activity_level_for_account_by_project,
          params: {}
        })}
        enableDrillDown={true}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>

    </DashboardRow>
  </Dashboard>

);
export default dashboard;