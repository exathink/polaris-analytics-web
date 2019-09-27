import {capitalizeFirstLetter} from "../../../../helpers/utility";

export function getStateType(workItemState) {
  if (workItemState != null) {
    if (['created', 'open', 'unscheduled', 'unstarted', 'planned', 'backlog'].includes(workItemState.toLowerCase())) {
      return 'initial'
    } else if (['closed', 'accepted'].includes(workItemState.toLowerCase())) {
      return 'terminal'
    } else {
      return 'in-progress'
    }
  }
}

export class WorkItemEventsTimelineChartModel {
  constructor(workItemEvents, workItemCommits, groupBy = 'workItem', stateFilter=null, filterCategories = null) {
    this.groupBy = groupBy;
    this.workItemEvents = workItemEvents;
    this.workItemCommits = workItemCommits;
    this.allEvents = [...workItemEvents, ...workItemCommits];
    this.getCategory = this.initCategorySelector(groupBy);
    this.timelineEvents = filterCategories || stateFilter ? this.filter(this.workItemEvents, this.workItemCommits, filterCategories, stateFilter) : this.allEvents;
    this.totalWorkItems = new Set(this.timelineEvents.map(event => event.displayId)).size;

    this.categoriesIndex = this.initCategoryIndex(this.timelineEvents);

  }




  initCategorySelector(groupBy) {
    if (groupBy === 'workItem') {
      return (workItem) => workItem.eventDate? workItem['name'] : workItem['workItemName']
    } else if (groupBy === 'event') {
      return (workItem) => workItem.eventDate? capitalizeFirstLetter(workItem['newState']) : 'Commit'
    } else if (groupBy === 'source') {
      return (workItem) => workItem['workItemsSourceName']
    } else if (groupBy === 'type') {
      return (workItem) => workItem['workItemType']
    } else {
      return (workItem) => workItem[groupBy]
    }
  }

  filter(workItemEvents, workItemCommits, filterCategories, stateFilter) {
    let filtered = workItemEvents;
    if (stateFilter != null) {
      filtered = workItemEvents.filter(workItem => getStateType(workItem.state) === stateFilter)
    }
    if (filterCategories != null) {
      filtered =  workItemEvents.filter(workItem => filterCategories.indexOf(this.getCategory(workItem)) !== -1)
    }
    return [
      ...filtered,
      ...workItemCommits.filter(commit => filtered.find(workItem=> workItem.displayId === commit.displayId))
    ]
  }

  initCategoryIndex(workItemEvents) {
    return workItemEvents.reduce(
      (index, workItemEvent) => {
        const category = this.getCategory(workItemEvent);
        if (index[category] === undefined) {
          index[category] = 1
        } else {
          index[category] = index[category] + 1
        }
        return index
      },
      {}
    );
  }


}

