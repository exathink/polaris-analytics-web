import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {ActivitySummaryWidget} from "../../widgets/activity/ActivitySummary";
import {ActivityProfileWidget} from '../../widgets/activity/ActivityLevel';
import {Contexts} from "../../../meta/contexts";
import Projects from "../../projects/context";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {DataSources} from "./dataSources";
import {OrganizationCommitSummaryWidget} from "./widgets/organizationCommitSummaryWidget";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};


export const dashboard = withNavigationContext(
  ({match, context, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`}  {...rest}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          name="activity-summary"
          title={messages.topRowTitle}
          primary={
            () =>
              <OrganizationCommitSummaryWidget
                organizationKey={context.getInstanceKey('organization')}
              />
          }
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.projects.display()}>
        <ActivityProfileWidget
          w={1 / 2}
          name="project-activity-levels"
          childContext={Projects}
          enableDrillDown={true}
          dataBinding={props => (
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
        <ActivityProfileWidget
          w={1 / 2}
          name="repository-activity-levels"
          childContext={Contexts.repositories}
          enableDrillDown={false}
          suppressDataLabelsAt={500}
          dataBinding={props => (
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
  )
);
export default dashboard;