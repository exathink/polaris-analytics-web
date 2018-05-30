import React from 'react';
import {FormattedMessage} from 'react-intl';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivityLevelDetailView, ActivityLevelSummaryView} from "../../../views/activity/ActivityLevel";
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";
import ModelBindings from "./modelBindings";
import {Contexts} from "../../../meta/contexts";



const dashboard_id = 'dashboards.activity.account';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Account Overview'/>
};

export const dashboard = (props) => (
  <Dashboard dashboard={`${dashboard_id}`} modelBindings={ModelBindings} {...props}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title={messages.topRowTitle}
        primary={ActivitySummaryViz}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.organizations.display()}>
      <DashboardItem
        w={1/2}
        name="org-activity-levels"
        childContext={Contexts.organizations}
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.projects.display()}>

    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>

    </DashboardRow>
  </Dashboard>

);
export default dashboard;