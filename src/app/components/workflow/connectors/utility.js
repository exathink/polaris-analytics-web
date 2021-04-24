const connectorTypeDisplayName = {
  'jira': 'Jira',
  'pivotal': 'Pivotal Tracker',
  'github' : 'Github',
  'gitlab' : 'Gitlab',
  'trello' : 'Trello',
  'bitbucket': 'BitBucket'
}

const connectorTypeProjectName = {
  jira: "Project",
  pivotal: "Project",
  github: "Project",
  gitlab: "Project",
  trello: "Board",
  bitbucket: "Project",
};

export function getConnectorTypeDisplayName(connectorType) {
  return connectorTypeDisplayName[connectorType] || connectorType;
}

export function getConnectorTypeProjectName(connectorType, plural = false) {
  if (plural === true) {
    return `${connectorTypeProjectName[connectorType]}s` || `${connectorType}s`;
  } else {
    return connectorTypeProjectName[connectorType] || connectorType;
  }
}