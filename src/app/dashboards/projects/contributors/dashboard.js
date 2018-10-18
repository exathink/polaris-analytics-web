import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ProjectDashboard} from "../projectDashboard";

const dashboard_id = 'dashboards.contributors.project';

export const dashboard = () => (
  <ProjectDashboard
  render ={
    ({project, context}) => {
      return (
        <Dashboard dashboard={`${dashboard_id}`}>

          <DashboardRow h='22%' title={Contexts.contributors.display()}>
            <DashboardWidget
              w={1 / 2}
              name="contributors-activity-profile"
              render={
                ({view}) =>
                  <DimensionContributorActivityProfileWidget
                    dimension={'project'}
                    childDimension={'contributors'}
                    instanceKey={project.key}
                    context={context}
                    childContext={Contributors}
                    enableDrillDown={true}
                    suppressDataLabelsAt={500}
                    view={view}
                    pageSize={50}
                  />}
              showDetail={true}
            />
            <DashboardWidget
              w={1 / 2}
              name="most-active-contributors"
              render={
                ({view}) =>
                  <DimensionMostActiveChildrenWidget
                    dimension={'project'}
                    instanceKey={project.key}
                    childConnection={'recentlyActiveContributors'}
                    context={context}
                    childContext={Contributors}
                    top={10}
                    latestCommit={project.latestCommit}
                    days={30}
                    view={view}
                  />
              }
              showDetail={true}
            />
          </DashboardRow>
        </Dashboard>
      )
    }
  }
  />
);
export default dashboard;