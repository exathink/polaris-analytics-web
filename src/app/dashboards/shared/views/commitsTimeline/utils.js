function reduceCategories(commits, category) {
  const catIndex = commits.reduce(
    (index, commit) => {
      index[commit[category]] = index[commit[category]] === undefined ? 1 : index[commit[category]] + 1;
      return index
    },
    {}
  );
  return {
    category: category,
    categories_index: catIndex
  }
}


export function getCategoriesIndex(commits, groupBy) {
  const category = groupBy || 'author';
  const catIndex = reduceCategories(commits, category);
  return (
    category !== 'author' && Object.keys(catIndex.categories_index).length <= 1 ?
      reduceCategories(commits, 'author')
      : catIndex
  )
}