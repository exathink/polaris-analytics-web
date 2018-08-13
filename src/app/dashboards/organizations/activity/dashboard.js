import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {DimensionActivitySummaryPanelWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";

import Projects from "../../projects/context"
import Repositories from "../../repositories/context";

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          name="activity-summary"
          title={messages.topRowTitle}
          render={() => <DimensionActivitySummaryPanelWidget dimension={'organization'} instanceKey={context.getInstanceKey('organization')} />}
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.projects.display()}>
        <DashboardWidget
          w={1 / 2}
          name="project-activity-levels"
          render={
            ({view}) =>
              <ChildDimensionActivityProfileWidget
                dimension={'organization'}
                instanceKey={context.getInstanceKey('organization')}
                childDimension={'projects'}
                context={context}
                childContext={Projects}
                enableDrillDown={true}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.repositories.display()}>
        <DashboardWidget
          w={1 / 2}
          name="repository-activity-levels"
          render={
            ({view}) =>
              <ChildDimensionActivityProfileWidget
                dimension={'organization'}
                instanceKey={context.getInstanceKey('organization')}
                childDimension={'repositories'}
                context={context}
                childContext={Repositories}
                enableDrillDown={true}
                suppressDataLabelsAt={500}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h='22%' title="Something Else">

      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;