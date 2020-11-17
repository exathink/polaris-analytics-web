import React from 'react';
import {
  Dashboard,
  DashboardRow,
  DashboardWidget,
} from '../../../framework/viz/dashboard';
import { ProjectStateTypesWidget } from './stateTypes';
import { ProjectDashboard } from '../projectDashboard';

const dashboard_id = 'dashboards.project.tutorial';

export const dashboard = () => (
  <ProjectDashboard
    render={({ project: { key } }) => {
      return (
        <Dashboard dashboard={dashboard_id}>
          <DashboardRow h={'60%'} title="Project Tutorial">
            <DashboardWidget
              w={1 / 2}
              name={'types'}
              title={'State Type Chart'}
              render={({ view }) => {
                return <ProjectStateTypesWidget instanceKey={key} view={view} type={'funnel'} />;
              }}
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 2}
              name={'blank'}
              title={'Blank Widget'}
              render={({ view }) => null}
            />
          </DashboardRow>
          <DashboardRow h={'30%'} title="Star Widget">
            <DashboardWidget
              w={1 / 2}
              name={'star'}
              title={'Star Display'}
              render={({ view }) => {
                if (view === 'primary') {
                  return <div>Awesome Star Widget</div>;
                }
                return <div>Maximized star widget goes here</div>;
              }}
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 2}
              name={'blank'}
              title={'Fav Widget'}
              render={({ view }) => null}
            />
          </DashboardRow>
        </Dashboard>
      );
    }}
  ></ProjectDashboard>
);

export default dashboard;
