import React from 'react';
import {FormattedMessage} from 'react-intl';
import { Dashboard, DashboardRow, DashboardItem} from '../../index';
import {ActivitySummaryViz} from "../../../views/activity/ActivitySummary";
import {ActivityLevelDetailView, ActivityLevelSummaryView} from "../../../views/activity/ActivityLevel";

import {Contexts} from "../../../meta/contexts";
import {DataSources} from "./dataSources";

const dashboard_id = 'dashboards.activity.projects.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Project Overview'/>
};


export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard={`${dashboard_id}`} {...rest}>
    <DashboardRow h='15%'>
      <DashboardItem
        w={1}
        name="activity-summary"
        title={messages.topRowTitle}
        primary={ActivitySummaryViz}
        dataBinding={ props => (
          {
            dataSource: DataSources.project_activity_summary,
            params: {
              project: props.context.getInstanceKey('project')
            }
          }
        )}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>
      <DashboardItem
        w={1/2}
        name="repository-activity-levels"
        childContext={Contexts.repositories}
        primary={ActivityLevelSummaryView}
        detail={ActivityLevelDetailView}
        dataBinding={ props => (
          {
            dataSource: DataSources.project_repositories_activity_summary,
            params: {
              project: props.context.getInstanceKey('project')
            }
          }
        )}
      />
    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
  </Dashboard>

);
export default dashboard;

