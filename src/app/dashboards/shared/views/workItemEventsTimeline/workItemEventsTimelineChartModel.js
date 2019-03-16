import {capitalizeFirstLetter} from "../../../../helpers/utility";

export class WorkItemEventsTimelineChartModel {
  constructor(workItemEvents, workItemCommits, totalWorkItems, groupBy = 'workItem', filterCategories = null) {
    this.groupBy = groupBy;
    this.workItemEvents = workItemEvents;
    this.workItemCommits = workItemCommits;
    this.allEvents = [...workItemEvents, ...workItemCommits];
    this.totalWorkItems = totalWorkItems;
    this.getCategory = this.initCategorySelector(groupBy)
    this.timelineEvents = filterCategories ? this.filter(this.allEvents, filterCategories) : this.allEvents
    this.categoriesIndex = this.initCategoryIndex(this.timelineEvents, groupBy, filterCategories)
  }


  initCategorySelector(groupBy) {
    if (groupBy == 'workItem') {
      return (workItem) => workItem['displayId']
    } else if (groupBy == 'status') {
      return (workItem) => workItem.eventDate? capitalizeFirstLetter(workItem['newState']) : 'Commit'
    } else if (groupBy == 'source') {
      return (workItem) => workItem['workItemsSourceName']
    } else {
      return (workItem) => workItem[groupBy]
    }
  }

  filter(workItemEvents, filterCategories) {
    return workItemEvents.filter(workItem => filterCategories.indexOf(this.getCategory(workItem)) !== -1)
  }

  initCategoryIndex(workItemEvents, groupBy, filterCategories) {
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