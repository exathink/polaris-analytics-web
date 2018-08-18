import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionActivitySummaryPanelWidget} from "../../shared/views/activitySummary";
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";

import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withUserContext} from "../../../framework/user/userContext";

const dashboard_id = 'dashboards.contributors.repository';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Contributors Overview'/>
};

export const dashboard = withUserContext(withNavigationContext(
  ({account, context}) => {


  return (
    <Dashboard dashboard={`${dashboard_id}`}>

      <DashboardRow h='22%' title={Contexts.contributors.display()}>
        <DashboardWidget
          w={1 / 2}
          name="contributors-activity-profile"
          render={
            ({view}) =>
              <DimensionContributorActivityProfileWidget
                dimension={'repository'}
                childDimension={'contributors'}
                instanceKey={context.getInstanceKey('repository')}
                context={context}
                childContext={Contributors}
                enableDrillDown={true}
                suppressDataLabelsAt={500}
                view={view}
              />}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
}));
export default dashboard;