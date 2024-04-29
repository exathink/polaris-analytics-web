/*
 * Copyright (c) Exathink, LLC  2016-2023.
 * All rights reserved
 *
 */
import {ProjectDashboard, useProjectContext} from "../../projectDashboard";
import {withViewerContext} from "../../../../framework/viewer/viewerContext";
import {Dashboard, DashboardRow, DashboardWidget} from "../../../../framework/viz/dashboard";
import {ProjectXmrWidget} from "./xmrCharts/xmrWidget";
import React from "react";


function ChartsDashboard() {
  const {project: {key, latestWorkItemEvent, latestCommit, settingsWithDefaults}, context} = useProjectContext();
  return (
    <Dashboard dashboard={`charts-dashboard`}>
      <DashboardRow h="22%" >
        <DashboardWidget
          title={'XMR Chart'}
          w={1 / 3}
          name="xmrchart"
          render={({view}) => (
            <ProjectXmrWidget
              dimension={'project'}
              instanceKey={key}
              specsOnly={false}
              view = {view}
              context={context}
              latestWorkItemEvent={latestWorkItemEvent}
              leadTimeTarget={30}
              cycleTimeTarget={14}
              leadTimeConfidenceTarget={0.9}
              cycleTimeConfidenceTarget={0.9}
              days={30}
              defectsOnly={false}
              specsOnly={true}
              initialMetric={'cycleTime'}

            />
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