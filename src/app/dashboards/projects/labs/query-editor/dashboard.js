/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */
import React from "react";
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";

import {SQLEditor} from "./queryEditor";

function ChartsDashboard() {
  const {project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults}, context} = useProjectContext();
  return (
    <Dashboard dashboard={`charts-dashboard`}>
      <DashboardRow h="80%">
        <DashboardWidget
          w={1}
          name="editor"
          render={({view}) => (
            <SQLEditor/>
          )}
          showDetail={true}
        />
      </DashboardRow>
    </Dashboard>
  );
}

export default withViewerContext(({viewerContext}) => (
  <ProjectDashboard pollInterval={1000 * 60}>
    <ChartsDashboard />
  </ProjectDashboard>
));