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
import {OrganizationProjectsActivityWidget} from "./widgets/organizationProjectsActivityWidget";
import {OrganizationRepositoriesActivityWidget} from "./widgets/organizationRepositoriesActivityWidget";

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
          organizationKey={context.getInstanceKey('organization')}
          primary={OrganizationCommitSummaryWidget}
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.projects.display()}>
        <DashboardWidget
          w={1 / 2}
          name="project-activity-levels"
          childContext={Projects}
          context = {context}
          enableDrillDown={true}
          organizationKey={context.getInstanceKey('organization')}
          primary={(props) => <OrganizationProjectsActivityWidget view={'summary'}  {...props}/>}
          detail={(props) => <OrganizationProjectsActivityWidget view={'detail'} {...props} />}
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.repositories.display()}>
        <DashboardWidget
          w={1 / 2}
          name="repository-activity-levels"
          context={context}
          childContext={Contexts.repositories}
          enableDrillDown={false}
          suppressDataLabelsAt={500}
          organizationKey={context.getInstanceKey('organization')}
          primary={(props) => <OrganizationRepositoriesActivityWidget view={'summary'}  {...props}/>}
          detail={(props) => <OrganizationRepositoriesActivityWidget view={'detail'} {...props} />}
        />
      </DashboardRow>
      <DashboardRow h='22%' title="Something Else">

      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;