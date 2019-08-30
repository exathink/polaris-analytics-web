const connectorTypeDisplayName = {
  'jira': 'Jira',
  'pivotal': 'Pivotal Tracker',
  'github' : 'Github',
  'gitlab' : 'Gitlab',
  'bitbucket': 'BitBucket'
}

export function getConnectorTypeDisplayName(connectorType) {
  return connectorTypeDisplayName[connectorType] || connectorType;
}