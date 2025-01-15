/*
 * Copyright (c) Exathink, LLC  2016-2025.
 * All rights reserved
 *
 */

import React from "react";

function createQueryString(queryParams) {
  const {dashboardParams = {}, ...globalParams} = queryParams;

  // Dashboard params are prefixed with a 'var-'.
  const dashboardQueryString = Object.entries(dashboardParams)
    .map(([key, value]) => `var-${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  const globalQueryString = Object.entries(globalParams)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  // Combine both query strings
  const queryString = [dashboardQueryString, globalQueryString].filter(Boolean).join("&");
  return queryString;
}

export function GrafanaDashboard({ title='DevLake', grafanaUrl, path, queryParams, kiosk=true }) {
  // Separate dashboard-specific params and global params
  const queryString = createQueryString(queryParams);

  // Construct the Grafana URL
  const grafanaPath = `${grafanaUrl}${path}?${queryString}`;


  return (
    <div style={{width: '100%', height: '100vh', overflow: 'hidden'}}>
      <iframe
        src={ kiosk ? `${grafanaPath}&kiosk` : `${grafanaPath}`}
        title={title}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
      ></iframe>
    </div>
  )
}

// Helper function to create query string
