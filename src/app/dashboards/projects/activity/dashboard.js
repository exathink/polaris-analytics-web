import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {ProjectCommitSummaryWidget} from "./widgets/projectCommitSummaryWidget";
import {ActivitySummaryWidget} from "../../widgets/activity/ActivitySummary";
import {ActivityProfileWidget} from "../../widgets/activity/ActivityLevel";
import {Contexts} from "../../../meta/contexts";
import {DataSources} from "./dataSources";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";

const dashboard_id = 'dashboards.activity.projects.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Project Overview'/>
};


export const dashboard = withNavigationContext(({match, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`} {...rest}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          name="activity-summary"
          title={messages.topRowTitle}
          primary={
            props =>
              <ProjectCommitSummaryWidget projectKey={props.context.getInstanceKey('project')}/>
          }
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.repositories.display()}>
        <ActivityProfileWidget
          w={1 / 2}
          name="repository-activity-levels"
          childContext={Contexts.repositories}
          dataBinding={props => (
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
  )
);
export default dashboard;

