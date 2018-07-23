import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';

import {ProjectCommitSummaryWidget} from "./widgets/projectCommitSummaryWidget";
import {ActivitySummaryWidget} from "../../widgets/activity/ActivitySummary";
import {ActivityProfileWidget} from "../../widgets/activity/ActivityLevel";
import {Contexts} from "../../../meta/contexts";
import {DataSources} from "./dataSources";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ProjectRepositoriesActivityWidget} from "./widgets/projectRepositoriesActivityWidget";

const dashboard_id = 'dashboards.activity.projects.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Project Overview'/>
};


export const dashboard = withNavigationContext(({match, context, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`} {...rest}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          name="activity-summary"
          title={messages.topRowTitle}
          projectKey={context.getInstanceKey('project')}
          primary={ProjectCommitSummaryWidget}
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
          projectKey={context.getInstanceKey('project')}
          primary={(props) => <ProjectRepositoriesActivityWidget view={'summary'}  {...props}/>}
          detail={(props) => <ProjectRepositoriesActivityWidget view={'detail'} {...props} />}
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

