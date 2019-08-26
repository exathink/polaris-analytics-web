import React from "react";

const connectorTypeDisplayName = {
  'jira': 'Jira',
  'pivotal': 'Pivotal Tracker',
  'github': 'Github',
  'gitlab': 'Gitlab',
  'bitbucket': 'BitBucket'
}

const getServerUrl= (selectedConnector) =>{
  switch (selectedConnector.connectorType) {
    case 'pivotal':
      return 'Pivotal Tracker.com';
    case 'github':
      return 'GitHub.com';
    default:
      return selectedConnector.baseUrl;
  }
}

export function getConnectorTypeDisplayName(connectorType) {
  return connectorTypeDisplayName[connectorType] || connectorType;
}

export const ServerInfo = ({selectedConnector}) => {
  if(!selectedConnector) return null;
  return (
    <React.Fragment>
      <span>
        {selectedConnector.name}
      </span>
      <span className="server-url">
        ({getServerUrl(selectedConnector)})
      </span>
    </React.Fragment>
  )
}
