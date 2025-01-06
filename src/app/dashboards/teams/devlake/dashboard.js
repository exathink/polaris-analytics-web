/*
 * Copyright (c) Exathink, LLC  2016-2025.
 * All rights reserved
 *
 */

import React from "react";
import {withNavigationContext} from "../../../framework/navigation/components/withNavigationContext";
import {withDetailRoutes} from "../../../framework/viz/dashboard/withDetailRoutes";


export function DevLakeDashboard() {
  return (
    <div style={{width: '100%', height: '100vh', overflow: 'hidden'}}>
      <iframe
        src={'http://polaris-services.exathink.localdev:3002/grafana/d/be96p04k45f5sf/pr-cycle-time?orgId=1&kiosk'}
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