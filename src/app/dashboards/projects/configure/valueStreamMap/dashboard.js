/*
 * Copyright (c) Exathink, LLC  2016-2025.
 * All rights reserved
 *
 */

import React from "react";
import {withNavigationContext} from "../../../../framework/navigation/components/withNavigationContext";
import {withDetailRoutes} from "../../../../framework/viz/dashboard/withDetailRoutes";


export function MuralDashboard() {
  return (
    <div style={{width: '100%', height: '100vh', overflow: 'hidden'}}>
      <iframe
        src="https://app.mural.co/embed/256cd58b-4617-49e7-8997-314dd759a285"
        width="100%"
        height="100%"
        style={{
          minWidth: '640px',
          minHeight: '480px',
          backgroundColor: '#f4f4f4',
          border: '1px solid #efefef',
        }}
        sandbox="allow-same-origin allow-scripts allow-modals allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  )
}

export default withNavigationContext(withDetailRoutes(MuralDashboard));