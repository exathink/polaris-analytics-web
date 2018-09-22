import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget, DimensionCommitsNavigatorWidget, DimensionCumulativeCommitCountWidget,
  DimensionMostActiveChildrenWidget
} from "../../shared/widgets/accountHierarchy";
import {Contexts} from "../../../meta/contexts";
import Repositories from "../../repositories/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ChildDimensionActivityProfileWidget} from "../../shared/views/activityProfile";

const dashboard_id = 'dashboards.commit.commits.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Commit Overview'/>
};


export const dashboard = withNavigationContext(
  ({context}) => (
    <Dashboard dashboard={`${dashboard_id}`}>
      <DashboardRow h='15%'>
        <div>Hello world</div>
      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;

