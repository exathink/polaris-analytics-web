function reduceCategories(commits, category, filterCategories) {
  const catIndex = commits.reduce(
    (index, commit) => {
      if(!filterCategories || filterCategories.indexOf(commit[category]) >= 0) {
        index[commit[category]] = index[commit[category]] === undefined ? 1 : index[commit[category]] + 1;
      }
      return index
    },
    {}
  );
  return {
    category: category,
    categories_index: catIndex
  }
}


export function getCategoriesIndex(commits, groupBy, filterCategories) {
  const category = groupBy || 'author';
  const catIndex = reduceCategories(commits, category, filterCategories);
  return (
    !filterCategories && category !== 'author' && Object.keys(catIndex.categories_index).length <= 1 ?
      reduceCategories(commits, 'author', filterCategories)
      : catIndex
  )
}