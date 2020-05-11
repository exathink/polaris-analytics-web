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
    task: '#4445ec',
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

export const WorkItemStateTypeSortOrder = {
  backlog: 0,
  open: 1,
  wip: 2,
  complete: 3,
  closed: 4
}

export const WorkItemStateTypeDisplayName = {
  backlog: 'Backlog',
  open: 'Open',
  wip: 'Wip',
  complete: 'Code Complete',
  closed: 'Closed'
}

export const WorkItemStateTypeColor = {
  backlog: '#8f9a8e',
  open: '#069a99',
  wip: '#2f9a32',
  complete: '#47479a',
  closed: '#7824b5'
}

export const WorkItemStateTypeSubColors = {
  backlog: ['#8f9a8e', '#81859a', '#9a848d', '#878b9a', '#9a8a7f'],
  open: ['#069a99', '#22949a', '#15809a', '#8d7d9a', '#5b689a'],
  wip: ['#2f9a32', '#879a2e', '#639a0d', '#28a759', '#0aa737'],
  complete: ['#47479a', '#71499a', '#79579a', '#9a7f97', '#8d689a'],
  closed: ['#7824b5', '#9a0db5', '#4b09b5', '#0526b5', '#1603b5']
}

export function assignWorkItemStateColor(stateType, index) {
  // Assign a color from the sub pallete using the index. Wraps around to zero.
  return WorkItemStateTypeSubColors[stateType][index % WorkItemStateTypeSubColors[stateType].length]
}