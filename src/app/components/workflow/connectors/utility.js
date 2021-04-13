const connectorTypeDisplayName = {
  'jira': 'Jira',
  'pivotal': 'Pivotal Tracker',
  'github' : 'Github',
  'gitlab' : 'Gitlab',
  'trello' : 'Trello',
  'bitbucket': 'BitBucket'
}

export function getConnectorTypeDisplayName(connectorType) {
  return connectorTypeDisplayName[connectorType] || connectorType;
}