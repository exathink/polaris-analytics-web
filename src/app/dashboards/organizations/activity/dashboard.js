import React from 'react';
import {FormattedMessage} from 'react-intl';

import { Dashboard, DashboardRow, DashboardItem} from '../../../framework/viz/dashboard/index';
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";
import {ActivityLevelDetailView, ActivityLevelSummaryView} from '../../../views/activity/ActivityLevel';

import {Contexts} from "../../../meta/contexts";
import {DataSources} from "./dataSources";

const dashboard_id = 'dashboards.activity.organization.instance';

const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};

export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard={`${dashboard_id}`}  {...rest}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title={messages.topRowTitle}
        primary={ActivitySummaryViz}
        dataBinding={ props => (
          {
            dataSource: DataSources.organization_activity_summary,
            params: {
              organization: props.context.getInstanceKey('organization')
            }
          }
        )}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.projects.display()}>
      <DashboardItem
        w={1/2}
        name="project-activity-levels"
        childContext={Contexts.projects}
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
        dataBinding={ props => (
          {
            dataSource: DataSources.organization_projects_activity_summary,
            params: {
              organization: props.context.getInstanceKey('organization')
            }
          }
        )}
        enableDrillDown={true}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>

    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
  </Dashboard>

);
export default dashboard;