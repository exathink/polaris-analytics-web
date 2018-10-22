import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionCommitsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";

import {ProjectDashboard} from "../projectDashboard";
import {getTimelineRefreshInterval} from "../../shared/helpers/commitUtils";

const dashboard_id = 'dashboards.activity.projects.instance';
const messages = {
  topRowTitle: <FormattedMessage id={`${dashboard_id}.topRowTitle`} defaultMessage='Activity Overview'/>
};


export const dashboard = () => (
  <ProjectDashboard
    pollInterval={1000*60}
    render={
      ({project, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h='15%'>
            <DashboardWidget
              w={1}
              name="activity-summary"
              title={messages.topRowTitle}
              render={
                () =>
                  <DimensionActivitySummaryPanelWidget
                    dimension={'project'}
                    instanceKey={project.key}
                  />
              }
            />
          </DashboardRow>
          <DashboardRow h='90%'>
            <DashboardWidget
              w={1}
              name="commits"
              render={
                ({view}) =>
                  <DimensionCommitsNavigatorWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    context={context}
                    view={view}
                    days={1}
                    latestCommit={project.latestCommit}
                    groupBy={'repository'}
                    showHeader
                    showTable
                  />
              }
              showDetail={true}
            />
          </DashboardRow>

        </Dashboard>
      )
    }
    />
);
export default dashboard;

