/*
 * Copyright (c) Exathink, LLC  2016-2025.
 * All rights reserved
 *
 */

import React from "react";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withDetailRoutes} from "../../../framework/viz/dashboard/withDetailRoutes";


export function DevLakeDashboard() {
  const source = "http://polaris-services.exathink.localdev:3006/grafana/d/be9vwx873s0e8b/pr-cycle-time-with-summary?orgId=1&from=1642189510940&to=1673725510940";
  return (
    <div style={{width: '100%', height: '100vh', overflow: 'hidden'}}>
      <iframe
        src={`${source}&kiosk`}
        title="DevLake"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      ></iframe>
    </div>
  )
}

export default withNavigationContext(withDetailRoutes(DevLakeDashboard));