import React from 'react';
import {Dashboard, DashboardRow, DashboardWidget} from '../../../framework/viz/dashboard';
import {DimensionContributorActivityProfileWidget} from "../../shared/views/activityProfile";

import {Contexts} from "../../../meta/contexts";
import Contributors from "../../contributors/context";
import {DimensionMostActiveChildrenWidget} from "../../shared/widgets/accountHierarchy";
import {ProjectDashboard} from "../projectDashboard";
import {OrgTeamsTableWidget} from "../../organizations/contributors/teams/orgTeamsTableWidget";

const dashboard_id = 'dashboards.contributors.project';

export const dashboard = () => (
  <ProjectDashboard
    pollInterval={60*1000}
    render={
      ({project, context}) => {
        return (
          <Dashboard dashboard={`${dashboard_id}`}>
            <DashboardRow h="22%" title={"Contributors, Last 90 Days"}>
              <DashboardWidget
                w={1}
                name="contributors-activity-profile"
                render={({view}) => (
                  <DimensionContributorActivityProfileWidget
                    dimension={"project"}
                    childDimension={"contributors"}
                    instanceKey={project.key}
                    context={context}
                    childContext={Contributors}
                    enableDrillDown={true}
                    suppressDataLabelsAt={500}
                    view={view}
                    pageSize={500}
                    referenceDate={project.latestCommit}
                  />
                )}
                showDetail={true}
              />
            </DashboardRow>
            <DashboardRow h={"68%"} title={"Teams"}>
              <DashboardWidget
                w={1}
                name={`Teams`}
                render={({view}) => (
                  <OrgTeamsTableWidget
                    organizationKey={project.organizationKey}
                    days={30}
                    measurementWindow={30}
                    samplingFrequency={30}
                    specsOnly={true}
                    includeSubTasks={false}
                    latestCommit={project.latestCommit}
                    latestWorkItemEvent={project.latestWorkItemEvent}
                  />
                )}
                showDetail={true}
              />
            </DashboardRow>
          </Dashboard>
        );
      }
    }
  />
);
export default dashboard;