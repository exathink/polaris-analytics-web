import React from "react";
import {average} from "../../../helpers/utility";

export function useSummaryStats({summaryStatsColumns, extraFilter}) {
  const [appliedFilters, setAppliedFilters] = React.useState([]);
  const [appliedSorter, setAppliedSorter] = React.useState();
  const [appliedName, setAppliedName] = React.useState();

  function handleChange(p, f, s, e) {
    const nonNullKeys = Object.entries(f).reduce((acc, item) => {
      const [key, value] = item;
      if (value !== null) {
        acc = [...acc, key];
      }
      return acc;
    }, []);

    setAppliedFilters(nonNullKeys);
    setAppliedSorter(s?.column?.dataIndex);
    setAppliedName(s?.column?.title);
  }

  let allFilters = appliedFilters;
  if (extraFilter) {
    if (!appliedFilters.includes(extraFilter)) {
      allFilters = [...appliedFilters, extraFilter];
    }
  }

  const getAvgFiltersData = (pageData) => {
    return allFilters
      .filter((x) => summaryStatsColumns[x])
      .map((appliedFilter) => {
        return {appliedFilter, average: average(pageData, (item) => +item[appliedFilter])};
      });
  };

  const getAvgSortersData = (pageData) => {
    return allFilters.includes(appliedSorter)===false && appliedSorter && summaryStatsColumns[appliedSorter]
      ? average(pageData, (item) => +item[appliedSorter])
      : undefined;
  };

  return {appliedFilters: allFilters, appliedSorter, appliedName, handleChange, getAvgFiltersData, getAvgSortersData};
}
