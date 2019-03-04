
import {capitalizeFirstLetter} from "../../../../helpers/utility";

export class WorkItemEventsTimelineChartModel {
  constructor(workItemEvents, totalWorkItems, groupBy='state', filterCategories=null) {
    this.groupBy = groupBy;
    this.totalWorkItems = totalWorkItems;
    this.getCategory = this.initCategorySelector(groupBy)
    this.workItemEvents = filterCategories ? this.filter(workItemEvents, filterCategories) : workItemEvents
    this.categoriesIndex = this.initCategoryIndex(this.workItemEvents, groupBy, filterCategories)
  }


  initCategorySelector(groupBy) {
    if (groupBy == 'workItem') {
      return (workItem) => workItem['displayId']
    } else if (groupBy == 'status') {
      return (workItem) => capitalizeFirstLetter(workItem['newState'])
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
          index[category] = index[category]+ 1
        }
        return index
      },
      {}
    );
  }


}