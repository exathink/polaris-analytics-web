/*
 * Copyright (c) Exathink, LLC  2016-2025.
 * All rights reserved
 *
 */

import React from "react";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withDetailRoutes} from "../../../framework/viz/dashboard/withDetailRoutes";
import {GrafanaDashboard} from "../../../components/grafana/grafanaDashboard";
import {GRAFANA_URL} from "../../../../config/url";
import {TeamDashboard} from "../teamDashboard";
import {withViewerContext} from "../../../framework/viewer/viewerContext";
import {DashboardRow} from "../../../framework/viz/dashboard";

export function PrAnalyticsDashboard({
  team: {key, latestWorkItemEvent, latestCommit, latestPullRequestEvent, settings, settingsWithDefaults},
  context,
  viewerContext}) {
  const {
    grafanaOrgId,
    devLakeProject
  } = settingsWithDefaults;

  return (
    <GrafanaDashboard
      grafanaUrl={GRAFANA_URL}
      path={"/d/be9vwx873s0e8b/pr-cycle-time-with-summary"}
      queryParams={{
        orgId: grafanaOrgId,
        dashboardParams: {
          project: devLakeProject,
        }
      }}
    />
  );
}


export const dashboard = ({viewerContext}) => (
  <TeamDashboard
    pollInterval={1000 * 60}
    render={(props) => <PrAnalyticsDashboard viewerContext={viewerContext} {...props} />}
  />
);
export default withViewerContext(dashboard);

