export const Colors = {
  ActivityLevel: {
    INITIAL: '#8f9a8e',
    ACTIVE: '#46b518',
    RECENT: '#7493b5',
    DORMANT: '#81b4eb',
    INACTIVE: '#2ed8ec',
    UNKNOWN: '#d02e0d'
  },
  WorkItemType: {
    story: '#14753a',
    bug: '#b5111a',
    pullRequest: '#7824b5',
    epic: '#b5945a',
    task: '#229cb5',
    default: '#8f9a8e'
  },
  Chart: {
    backgroundColor: "#f2f3f6"
  }

};

export const WorkItemColorMap = {
  issue: Colors.WorkItemType.story,
  story: Colors.WorkItemType.story,
  bug: Colors.WorkItemType.bug,
  epic: Colors.WorkItemType.epic,
  task: Colors.WorkItemType.task,
  subtask: Colors.WorkItemType.task,
  pull_request: Colors.WorkItemType.pullRequest
}

export const Symbols = {
  WorkItemType: {
    story: 'circle',
    bug: 'circle',
    pullRequest: 'triangle-down',
    epic: 'diamond',
    task: 'square'
  }
}

export const WorkItemSymbolMap = {
  issue: Symbols.WorkItemType.story,
  story: Symbols.WorkItemType.story,
  bug: Symbols.WorkItemType.bug,
  epic: Symbols.WorkItemType.epic,
  task: Symbols.WorkItemType.task,
  subtask: Symbols.WorkItemType.task,
  pull_request: Symbols.WorkItemType.pullRequest
}

export const WorkItemTypeSortOrder = {
  epic: 0,
  issue: 1,
  story: 1,
  bug: 1,
  task: 2,
  subtask: 3,
  pull_request: 4
}

export const WorkItemTypeScatterRadius = {
  epic: 8,
  issue: 5,
  story: 5,
  bug: 5,
  task: 4,
  subtask: 3,
  pull_request: 4
}

export const WorkItemTypeDisplayName = {
  epic: 'Epic',
  issue: 'Issue',
  story: 'Story',
  bug: 'Bug',
  task: 'Task',
  subtask: 'Subtask',
  pull_request: 'Pull Request'
}