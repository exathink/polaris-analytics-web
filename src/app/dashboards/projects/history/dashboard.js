import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {
  DimensionCommitHistoryWidget,
  DimensionWeeklyContributorCountWidget
} from "../../shared/widgets/accountHierarchy";
import {ProjectDashboard} from "../projectDashboard";

const dashboard_id = 'dashboards.history.projects.instance';


export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60*1000}
    render={
      ({project, context}) => (
        <Dashboard dashboard={`${dashboard_id}`}>
          <DashboardRow h='100%'>
            <DashboardWidget
              w={1 / 2}
              name="cumulative-commit-count"
              render={
                ({view}) =>
                  <DimensionCommitHistoryWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    context={context}
                    view={view}
                    detailViewCommitsGroupBy={'repository'}
                    referenceDate={project.latestCommit}
                  />
              }
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 2}
              name="weekly-contributor-count"
              render={
                (view) =>
                  <DimensionWeeklyContributorCountWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    context={context}
                    view={view}
                    referenceDate={project.latestCommit}
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

