import React from "react";
import { useIntl } from "react-intl";
import { tooltipHtml_v2 } from "../../../../../../framework/viz/charts/tooltip";
import { capitalizeFirstLetter, i18nNumber, localNow } from "../../../../../../helpers/utility";
import { getHistogramSeries } from "../../../../../projects/shared/helper/utils";
import { ClearFilters } from "../../../../components/clearFilters/clearFilters";
import { AppTerms, assignWorkItemStateColor, WorkItemFlowTypeColor } from "../../../../config";
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
  [Quadrants.ok]: `Age <= ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime <= ${i18nNumber(intl, latencyTarget, 1)} days`,
  [Quadrants.latency]: `Age <= ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime > ${i18nNumber(intl, latencyTarget, 1)} days`,
  [Quadrants.age]: `Age > ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime <= ${i18nNumber(intl, latencyTarget, 1)} days`,
  [Quadrants.critical]: `Age > ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime > ${i18nNumber(intl, latencyTarget, 1)} days`
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
        color: WorkItemFlowTypeColor[points[0].flowType]
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