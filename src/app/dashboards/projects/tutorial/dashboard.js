import React from "react";
import {
  Dashboard,
  DashboardRow,
  DashboardWidget,
} from "../../../framework/viz/dashboard";

import { ProjectDashboard } from "../projectDashboard";

import { ProjectStateTypesWidget } from "./stateTypes";

const dashboard_id = "dashboards.project.tutorial";

export const dashboard = () => (
  <ProjectDashboard
    render={({ project: { key } }) => (
      <Dashboard dashboard={`${dashboard_id}`}>
        <DashboardRow h={1 / 2} title={"Project Tutorial"}>
          <DashboardWidget
            w={1 / 2}
            name={"types"}
            title={"State Type Chart"}
            render={({ view }) => (
              <ProjectStateTypesWidget instanceKey={key} view={view} />
            )}
            showDetail={true}
          />
          <DashboardWidget
            w={1 / 2}
            name={"blank"}
            title={"Blank Widget"}
            render={({ view }) => null}
          />
        </DashboardRow>
      </Dashboard>
    )}
  />
);
export default dashboard;
