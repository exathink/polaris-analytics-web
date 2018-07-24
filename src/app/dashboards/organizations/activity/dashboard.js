import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import Projects from "../../projects/context";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {CommitSummaryWidget} from "../../widgets/activity/ActivitySummary";
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
          primary={() => <CommitSummaryWidget dimension={'organization'} instanceKey={context.getInstanceKey('organization')} />}
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