import React from 'react';
import {FormattedMessage} from 'react-intl';

import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {Contexts} from "../../../meta/contexts";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";

import Projects from "../../projects/context"

const dashboard_id = 'dashboards.activity.organization.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Organization Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
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
                pageSize={50}
              />
          }
          showDetail={true}
        />
        <DashboardWidget
          w={1 / 2}
          name="most-active-projects"
          render={
            ({view}) =>
              <DimensionMostActiveChildrenWidget
                dimension={'organization'}
                instanceKey={context.getInstanceKey('organization')}
                childConnection={'recentlyActiveProjects'}
                context={context}
                childContext={Projects}
                top={10}
                days={1}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;