import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget, DimensionCommitsNavigatorWidget, DimensionCumulativeCommitCountWidget,
  DimensionMostActiveChildrenWidget, DimensionWeeklyContributorCountWidget
} from "../../shared/widgets/accountHierarchy";
import {Contexts} from "../../../meta/contexts";
import Repositories from "../../repositories/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";

const dashboard_id = 'dashboards.history.projects.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Project Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h='100%'>
        <DashboardWidget
          w={1/2}
          name="cumulative-commit-count"
          render={
            (view) =>
              <DimensionCumulativeCommitCountWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                context={context}
                view={view}
              />
          }
          showDetail={true}
        />
        <DashboardWidget
          w={1/2}
          name="weekly-contributor-count"
          render={
            (view) =>
              <DimensionWeeklyContributorCountWidget
                dimension={'project'}
                instanceKey={context.getInstanceKey('project')}
                context={context}
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

