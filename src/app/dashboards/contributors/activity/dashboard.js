import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {ContributorActivitySummaryWidget} from "../widgets/activitySummaryWidget";
import {
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";
import {Contexts} from "../../../meta/contexts";
import {ContributorRepositoriesActivityProfileWidget} from "../widgets/contributorRepositoriesActivityProfileWidget";
import {ContributorMostActiveRepositoriesWidget} from "../widgets/contributorMostActiveRepositoriesWidget";
import Repositories from "../../repositories/context";

const dashboard_id = 'dashboards.activity.contributors.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Contributor Overview'/>
};


export const dashboard = withNavigationContext(({match, context, ...rest}) => (
    <Dashboard dashboard={`${dashboard_id}`} {...rest}>
      <DashboardRow h='15%'>
        <DashboardWidget
          w={1}
          name="activity-summary"
          title={messages.topRowTitle}
          render={
            () =>
              <ContributorActivitySummaryWidget
                instanceKey={context.getInstanceKey('contributor')}
              />
          }
        />
      </DashboardRow>
      <DashboardRow h='22%' title={Contexts.repositories.display()}>
        <DashboardWidget
          w={1 / 2}
          name="repository-activity-levels"
          render={
            ({view}) =>
              <ContributorRepositoriesActivityProfileWidget
                dimension={'contributors'}
                instanceKey={context.getInstanceKey('contributor')}
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
        <DashboardWidget
          w={1 / 2}
          name="most-active-repositories"
          render={
            ({view}) =>
              <ContributorMostActiveRepositoriesWidget
                dimension={'contributor'}
                instanceKey={context.getInstanceKey('contributor')}
                childConnection={'recentlyActiveRepositories'}
                context={context}
                childContext={Repositories}
                top={5}
                days={30}
                view={view}
              />
          }
          showDetail={true}
        />
      </DashboardRow>
      <DashboardRow h='63%'>
        <DashboardWidget
          w={1}
          name="commits"
          render={
            ({view}) =>
              <DimensionCommitsNavigatorWidget
                dimension={'contributor'}
                instanceKey={context.getInstanceKey('contributor')}
                context={context}
                view={view}
                days={30}
                groupBy={'repository'}
                smartGrouping={false}
                showHeader
                showTable
              />
          }
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  )
);
export default dashboard;

