import React from 'react';
import {FormattedMessage} from 'react-intl';

import { Dashboard, DashboardRow} from '../../../framework/viz/dashboard';

import {ActivitySummary} from "../../widgets/activity/ActivitySummary";
import {ActivityProfile} from '../../widgets/activity/ActivityLevel';
import {Contexts} from "../../../meta/contexts";
import {DataSources} from "./dataSources";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};



export const dashboard = ({match, ...rest}) => (
  <Dashboard dashboard={`${dashboard_id}`}  {...rest}>
    <DashboardRow h='15%'>
      <ActivitySummary
        w={1}
        name="activity-summary"
        title={messages.topRowTitle}
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
      <ActivityProfile
        w={1/2}
        name="project-activity-levels"
        childContext={Contexts.projects}
        enableDrillDown={true}
        dataBinding={ props => (
          {
            dataSource: DataSources.activity_level_for_organization_by_project,
            params: {
              organization: props.context.getInstanceKey('organization')
            }
          }
        )}
      />
    </DashboardRow>
    <DashboardRow h='22%' title={Contexts.repositories.display()}>
      <ActivityProfile
        w={1/2}
        name="repository-activity-levels"
        childContext={Contexts.repositories}
        enableDrillDown={false}
        suppressDataLabelsAt={500}
        dataBinding={ props => (
          {
            dataSource: DataSources.activity_level_for_organization_by_repository,
            params: {
              organization: props.context.getInstanceKey('organization')
            }
          }
        )}
      />
    </DashboardRow>
    <DashboardRow h='22%' title="Something Else">

    </DashboardRow>
  </Dashboard>

);
export default dashboard;