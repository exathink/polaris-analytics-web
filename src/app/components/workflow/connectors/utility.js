const connectorTypeDisplayName = {
  'atlassian': 'Jira', // there is a Jira record in database with connectorType 'atlassian' instead of jira.
  'jira': 'Jira',
  'pivotal': 'Pivotal Tracker',
  'github' : 'Github',
  'gitlab' : 'Gitlab',
  'bitbucket': 'BitBucket'
}

export function getConnectorTypeDisplayName(connectorType) {
  return connectorTypeDisplayName[connectorType] || connectorType;
}