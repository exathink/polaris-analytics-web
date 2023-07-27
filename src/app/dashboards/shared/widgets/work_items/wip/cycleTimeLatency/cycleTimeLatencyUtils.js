import React from "react";
import { useIntl } from "react-intl";
import { tooltipHtml_v2 } from "../../../../../../framework/viz/charts/tooltip";
import { capitalizeFirstLetter, i18nNumber, localNow } from "../../../../../../helpers/utility";
import { allPairs, getHistogramCategories, getHistogramSeries } from "../../../../../projects/shared/helper/utils";
import { ClearFilters } from "../../../../components/clearFilters/clearFilters";
import { AppTerms, WorkItemStateTypes, workItemFlowTypeColor } from "../../../../config";
import { projectDeliveryCycleFlowMetricsMeta } from "../../../../helpers/metricsMeta";

export const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export const Quadrants = {
  ok: "ok",
  latency: "latency",
  age: "age",
  critical: "critical"
};

export const getQuadrant = (cycleTime, latency, cycleTimeTarget, latencyTarget) => {
  if (cycleTime <= cycleTimeTarget && latency <= latencyTarget) {
    return Quadrants.ok;
  }

  if (cycleTime <= cycleTimeTarget && latency > latencyTarget) {
    return Quadrants.latency;
  }

  if (cycleTime > cycleTimeTarget && latency <= latencyTarget) {
    return Quadrants.age;
  }

  if (cycleTime > cycleTimeTarget && latency > latencyTarget) {
    return Quadrants.critical;
  }
};


export const QuadrantColors = {
  [Quadrants.ok]: "#4ade80",
  [Quadrants.latency]: "#facc15",
  [Quadrants.age]: "#fb923c",
  [Quadrants.critical]: "#f87171"
};

export function getQuadrantColor(cycleTime, latency, cycleTimeTarget, latencyTarget) {
  return QuadrantColors[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)];
}

export const QuadrantNames = {
  [Quadrants.ok]: "Moving",
  [Quadrants.latency]: "Slowing",
  [Quadrants.age]: "Delayed",
  [Quadrants.critical]: "Stalled"
};
export const getQuadrantDescription = ({ intl, cycleTimeTarget, latencyTarget }) => ({
  [Quadrants.ok]: `Age <= ${i18nNumber(intl, cycleTimeTarget, 0)} days, Last Moved <= ${i18nNumber(intl, latencyTarget, 1)} days`,
  [Quadrants.latency]: `Age <= ${i18nNumber(intl, cycleTimeTarget, 0)} days, Last Moved > ${i18nNumber(intl, latencyTarget, 1)} days`,
  [Quadrants.age]: `Age > ${i18nNumber(intl, cycleTimeTarget, 0)} days, Last Moved <= ${i18nNumber(intl, latencyTarget, 1)} days`,
  [Quadrants.critical]: `Age > ${i18nNumber(intl, cycleTimeTarget, 0)} days, Last Moved > ${i18nNumber(intl, latencyTarget, 1)} days`
});

export function getQuadrantName(cycleTime, latency, cycleTimeTarget, latencyTarget) {
  return QuadrantNames[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)];
}

function sortByFlowType([state_a, [point_a]], [state_b, [point_b]]) {
  if (point_a.flowType === "waiting" && point_b.flowType !== "waiting") {
    return 1;
  } else if (point_a.flowType === point_b.flowType) {
    return 0;
  } else {
    return -1;
  }
}

export function useCycleTimeLatencyHook(workItems) {
  const intl = useIntl();
  const seriesData = React.useMemo(() => {
    const pointsByState = workItems
      .filter((cycle) => cycle.workItemType !== "epic")
      .reduce((acc, item, index) => {
        const ageVal = projectDeliveryCycleFlowMetricsMeta["age"].value(item);
        if (acc[item.state] == null) {
          acc[item.state] = [{ ageVal, ...item }];
        } else {
          acc[item.state] = [...acc[item.state], { ageVal, ...item }];
        }
        return acc;
      }, {});

    // Sort pointsByState so that the items with flowType waiting are at the beginning of the array

    const seriesArr = Object.entries(pointsByState).sort(
      // sort by flow type with waiting at the beginning
      ([state_a, [point_a]], [state_b, [point_b]]) => {
        if (point_a.flowType === "waiting" && point_b.flowType !== "waiting") {
          return 1;
        } else if (point_a.flowType === point_b.flowType) {
          return 0;
        } else {
          return -1;
        }
      }
    ).map(([state, points], index) => {
      return getHistogramSeries({
        id: state,
        intl,
        colWidthBoundaries: COL_WIDTH_BOUNDARIES,
        name: String(state).toLowerCase(),
        points: points.map(x => x.ageVal),
        originalData: points,
        color: workItemFlowTypeColor(points[0].flowType)
      });
    });

    return seriesArr;
  }, [workItems, intl]);

  return seriesData;
}

export function getSubTitleForHistogram({ workItems, specsOnly, intl }) {
  const count = workItems.length;

  const countDisplay = `${count} ${
    count === 1
      ? specsOnly
        ? AppTerms.spec.display
        : AppTerms.card.display
      : specsOnly
        ? AppTerms.specs.display
        : AppTerms.cards.display
  }`;

  return `${countDisplay} as of ${localNow(intl)}`;
}

export function getTitleForHistogram({ workItems, specsOnly, stageName }) {
  const count = workItems.length;

  const countDisplay = `${count} ${
    count === 1
      ? specsOnly
        ? AppTerms.spec.display
        : AppTerms.card.display
      : specsOnly
        ? AppTerms.specs.display
        : AppTerms.cards.display
  }`;

  return `Age Analysis: ${countDisplay} in ${stageName}`;
}

export function getTooltipForAgeLatency(tooltipObj, title, intl) {
  return tooltipHtml_v2({
    header: `${capitalizeFirstLetter(tooltipObj.series.name)}: ${tooltipObj.point.category} <br/> ${tooltipObj.point.y} ${title}`,
    body: [[`Average age: `, `${i18nNumber(intl, tooltipObj.point.options.total / tooltipObj.point.y, 2)} days`]]
  });
}

export function AgeFilterWrapper({ selectedFilter, handleClearClick }) {
  return (
    <div className="tw-absolute tw-right-12 tw-top-0">
      <ClearFilters
        selectedFilter={selectedFilter}
        selectedMetric={"Age Bucket"}
        stateType={""}
        handleClearClick={handleClearClick}
      />
    </div>
  );
}

export function QuadrantFilterWrapper({ selectedFilter, selectedQuadrant, handleClearClick }) {
  return (
    <div className="tw-absolute tw-right-12 tw-top-0">
      <ClearFilters
        selectedFilter={selectedFilter}
        selectedMetric={selectedQuadrant}
        stateType={""}
        handleClearClick={handleClearClick}
      />
    </div>
  );
}

export function QueueSizeFilterWrapper({ selectedFilter, handleClearClick }) {
  return (
    <div className="tw-absolute tw-right-12 tw-top-0">
      <ClearFilters
        selectedFilter={selectedFilter}
        selectedMetric={"State"}
        stateType={""}
        handleClearClick={handleClearClick}
      />
    </div>
  );
}

export const FILTERS = {
  ISSUE_TYPE: "issuetype",
  WORK_STREAM: "workstream",
  TEAM: "team",
  QUADRANT_PANEL: "quadrantpanel",
  QUADRANT: "quadrant",
  CYCLETIME: "cycleTime",
  LATENCY: "latency",
  EFFORT: "effort",
  NAME: "name",
  STATE: "state",
  CATEGORY: "category",
  PRIMARY_CATEGORY: "primary_category",
  CURRENT_INTERACTION: "currentInteraction",
  HISTOGRAM_BUCKET: "histogram_bucket"
};

export const engineeringStateTypes = [WorkItemStateTypes.open, WorkItemStateTypes.make];
export const deliveryStateTypes = [WorkItemStateTypes.deliver];

export let filterFns = {
  [FILTERS.ISSUE_TYPE]: (w, [selectedIssueType]) =>
    selectedIssueType.value === "all" || w.workItemType === selectedIssueType.value,
  [FILTERS.WORK_STREAM]: (w, [selectedWorkStream]) =>
    selectedWorkStream.value === "all" || w.workItemsSourceName === selectedWorkStream.value,
  [FILTERS.TEAM]: (w, [selectedTeam]) => {
    const _teams = w.teamNodeRefs.map((t) => t.teamKey);
    return selectedTeam.value === "all" || _teams.includes(selectedTeam.value);
  },
  [FILTERS.QUADRANT_PANEL]: (w, [selectedQuadrant]) =>
    selectedQuadrant === undefined || selectedQuadrant === w.quadrant,
  [FILTERS.QUADRANT]: (w, filterVals) => {
    return filterVals.some((filterVal) => w.quadrant.indexOf(filterVal) === 0);
  },
  [FILTERS.CYCLETIME]: (w, filterVals) => {
    return filterVals.some((filterVal) => {
      return doesPairWiseFilterPass({value: filterVal, record: w, metric: "cycleTime"});
    });
  },
  [FILTERS.NAME]: (w, [filterVal]) => {
    const re = new RegExp(filterVal, "i");
    return w.name?.match?.(re) || w.displayId?.match?.(re) || w.epicName?.match?.(re);
  },
  [FILTERS.LATENCY]: (w, [filter, filterTo, type]) => {
    if (w.latency == null) {
      return false;
    }

    if (type === "inRange") {
      return w.latency >= filter && w.latency <= filterTo;
    }
    if (type === "lessThanOrEqual") {
      return w.latency <= filter;
    }
    if (type === "greaterThanOrEqual") {
      return w.latency >= filter
    }
  },
  [FILTERS.EFFORT]: (w, [filter, filterTo, type]) => {
    if (w.effort == null) {
      return false;
    }

    if (type === "inRange") {
      return w.effort >= filter && w.effort <= filterTo;
    }
    if (type === "lessThanOrEqual") {
      return w.effort <= filter;
    }
    if (type === "greaterThanOrEqual") {
      return w.effort >= filter
    }
  },
  // would be replaced at runtime, based on exclude value
  [FILTERS.STATE]: (w) => {},
  [FILTERS.PRIMARY_CATEGORY]: () => {},
  [FILTERS.CATEGORY]: (w, [chartCategory]) =>
    chartCategory === undefined ||
    (chartCategory === "engineering"
      ? engineeringStateTypes.indexOf(w.stateType) !== -1
      : deliveryStateTypes.indexOf(w.stateType) !== -1),
  [FILTERS.HISTOGRAM_BUCKET]: (w, bucketRecords) => {
    return bucketRecords.some(b => b.cycleTime === w.cycleTime);
  }
};

/**
 *
 * @typedef {Object} Props
 * @property {any[]} initData - data from the widget
 * @property {Map} appliedFilters - all applied filters
 * @property {object} filterFns - all filter conditions callback
 */

// appliedFilters: {filterKey1: [], filterKey2: [], filterKey3: []}; => can keep them in a Map
// filterFns: {filterKey1: (item, filterVals) => boolean, filterKey2: (item, filterVals) => boolean, filterKey3: (item, filterVals) => boolean}
// initData: [{}, {}, {}...]
/**
 * @param {Props} {
 * initData,
 * appliedFilters
 * filterFns
 * }
 */
export function getFilteredData({initData, appliedFilters, filterFns}) {
  let result = [];
  const [interaction, secondaryData] = appliedFilters.get(FILTERS.CURRENT_INTERACTION)?.value ?? [];

  if (interaction === "histogram" || interaction === "zoom_selection") {
    return secondaryData.selectedChartData;
  }
  if (interaction === "zoom_reset_selection") {
    return initData;
  }

  // remove currentInteraction
  const remainingFilters = [...appliedFilters.keys()].filter((k) => k !== FILTERS.CURRENT_INTERACTION).filter((k) => k !== FILTERS.PRIMARY_CATEGORY);

  initData.forEach((item) => {
    // apply all filters
    const allFiltersPassed = remainingFilters.every((filterKey) => {
      const filterValues = appliedFilters.get(filterKey)?.value;
      return filterFns[filterKey](item, filterValues);
    });

    // add the item if all filters are passed
    if (allFiltersPassed) {
      result.push(item);
    }
  });

  return result;
}

/**
 *
 * @param {Map} appliedFilters
 * @param {string} filterKey
 * @returns any
 */
export function getFilterValue(appliedFilters, filterKey) {
  const filterValues = appliedFilters.get(filterKey)?.value ?? [];
  return filterValues;
}

const allPairsData = allPairs(COL_WIDTH_BOUNDARIES);
export const categories = getHistogramCategories(COL_WIDTH_BOUNDARIES, "days");
export function doesPairWiseFilterPass({value, record, metric}) {
  const [part1, part2] = allPairsData[categories.indexOf(value)];
  return Number(record[metric]) >= part1 && Number(record[metric]) < part2;
}