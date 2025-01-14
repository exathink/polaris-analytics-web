/*
 * Copyright (c) Exathink, LLC  2016-2025.
 * All rights reserved
 *
 */

import React from "react";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withDetailRoutes} from "../../../framework/viz/dashboard/withDetailRoutes";
import {GrafanaDashboard} from "../../../components/grafana/grafanaDashboard";

export function PrAnalyticsDashboard() {
  return (
    <GrafanaDashboard
      grafanaUrl={"http://polaris-services.exathink.localdev:3006/grafana"}
      path={"/d/be9vwx873s0e8b/pr-cycle-time-with-summary"}
      queryParams={{
        orgId: 1,
        from: 1642189510940,
        to: 1673725510940
      }}
    />
  );
}

export default withNavigationContext(withDetailRoutes(PrAnalyticsDashboard));