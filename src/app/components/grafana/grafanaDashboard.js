/*
 * Copyright (c) Exathink, LLC  2016-2025.
 * All rights reserved
 *
 */

import React from "react";

export function GrafanaDashboard({ title='DevLake', grafanaUrl, path, queryParams, kiosk=true }) {
  // Convert queryParams object into a query string
  const queryString = createQueryString(queryParams);

  // Construct the source URL
  const source = `${grafanaUrl}${path}?${queryString}`;

  return (
    <div style={{width: '100%', height: '100vh', overflow: 'hidden'}}>
      <iframe
        src={ kiosk ? `${source}&kiosk` : `${source}`}
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
function createQueryString(params) {
  return Object.entries(params)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');
}

