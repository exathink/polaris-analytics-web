import React from 'react';
import {FormattedMessage} from 'react-intl';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionActivitySummaryPanelWidget,
  DimensionWorkItemEventsNavigatorWidget
} from "../../shared/widgets/accountHierarchy";

import {ProjectDashboard} from "../projectDashboard";

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
          <DashboardRow h={"59%"}>
            <DashboardWidget
              w={1}
              name="workItemEvents"
              render={
                ({view}) =>
                  <DimensionWorkItemEventsNavigatorWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    context={context}
                    view={view}
                    days={1}
                    latestCommit={project.latestCommit}
                    latestWorkItemEvent={project.latestWorkItemEvent}
                    groupBy={'workItem'}
                    groupings={['workItem', 'event' ,'type',  'source']}
                    showHeader={true}

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
