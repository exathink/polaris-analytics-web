const connectorTypeDisplayName = {
  'jira': 'Jira',
  'pivotal': 'Pivotal Tracker',
  'github' : 'Github',
  'gitlab' : 'Gitlab',
  'trello' : 'Trello',
  'bitbucket': 'BitBucket',
  'atlassian': 'Atlassian'
}

const DEFAULT_PROJECT_NAMES = {singular: "Project", plural: "Projects"}
const connectorTypeProjectName = {
  jira: DEFAULT_PROJECT_NAMES ,
  atlassian: DEFAULT_PROJECT_NAMES,
  pivotal: DEFAULT_PROJECT_NAMES,
  gitlab: DEFAULT_PROJECT_NAMES,
  bitbucket: DEFAULT_PROJECT_NAMES,
  github: {singular: "Repository", plural: "Repositories"},
  trello: {singular: "Board", plural: "Boards"},
};

export function getConnectorTypeDisplayName(connectorType) {
  return connectorTypeDisplayName[connectorType] || connectorType;
}

export function getConnectorTypeProjectName(connectorType, plural = false) {
  const projectNames = connectorTypeProjectName[connectorType];
  if (plural === true) {
    return projectNames ? projectNames.plural : DEFAULT_PROJECT_NAMES.plural;
  } else {
    return projectNames? projectNames.singular : DEFAULT_PROJECT_NAMES.singular;
  }
}