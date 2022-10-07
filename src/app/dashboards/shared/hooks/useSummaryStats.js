import React from "react";
import {average} from "../../../helpers/utility";
import {getMetricsMetaKey} from "../helpers/metricsMeta";

export function useSummaryStats({summaryStatsColumns, extraFilter, stateType}) {
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

  const _extraFilter = getMetricsMetaKey(extraFilter, stateType);
  const getAvgFiltersData = (pageData) => {
    let allFilters = appliedFilters;
    if (extraFilter) {
      if (!appliedFilters.includes(_extraFilter)) {
        allFilters = [...appliedFilters, _extraFilter];
      }
    }

    return allFilters
      .filter((x) => summaryStatsColumns[x])
      .map((appliedFilter) => {
        return {appliedFilter, average: average(pageData, (item) => +item[appliedFilter])};
      });
  };
      
  const getAvgSortersData = (pageData) => {
    let allFilters = appliedFilters;
    if (extraFilter) {
      if (!appliedFilters.includes(_extraFilter)) {
        allFilters = [...appliedFilters, _extraFilter];
      }
    }

    const _appliedSorter = getMetricsMetaKey(appliedSorter, stateType);
    return allFilters.includes(_appliedSorter)===false && appliedSorter && summaryStatsColumns[appliedSorter]
      ? average(pageData, (item) => +item[appliedSorter])
      : undefined;
  };

  return {appliedFilters, appliedSorter, appliedName, handleChange, getAvgFiltersData, getAvgSortersData};
}
