

export class CommitTimelineChartModel {
  constructor(commits, groupBy='author', filterCategories=null) {
    this.groupBy = groupBy;
    this.getCategory = this.initCategorySelector(groupBy)
    this.commits = filterCategories ? this.filter(commits, filterCategories) : commits
    this.categoriesIndex = this.initCategoryIndex(this.commits, groupBy, filterCategories)
  }


  initCategorySelector(groupBy) {
    if (groupBy !== 'workItems') {
      return (commit) => commit[groupBy]
    } else{
      // Does not handle commits that are attached to multiple issues. leaving it as it is for now
      // since that is not likely a very common scenario. Revisit if that changes.
      return (commit) => commit.workItemsSummaries.length > 0 ? commit.workItemsSummaries[0].displayId : "Untracked"
    }
    return null;
  }

  filter(commits, filterCategories) {
    return commits.filter(commit => filterCategories.indexOf(this.getCategory(commit)) !== -1)
  }

  initCategoryIndex(commits, groupBy, filterCategories) {
    return commits.reduce(
    (index, commit) => {
        const category = this.getCategory(commit);
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