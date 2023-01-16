import React from "react";
import {useIntl} from "react-intl";
import { localNow } from "../../../../../../helpers/utility";
import {getHistogramSeries} from "../../../../../projects/shared/helper/utils";
import { AppTerms } from "../../../../config";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../helpers/metricsMeta";
export const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export const Quadrants = {
  ok: 'ok',
  latency: 'latency',
  age: 'age',
  critical: 'critical'
}

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

export function getQuadrantColor(cycleTime, latency, cycleTimeTarget, latencyTarget){
  return QuadrantColors[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)]
}

export const QuadrantNames = {
  [Quadrants.ok]: "Moving",
  [Quadrants.latency]: "Slowing",
  [Quadrants.age]: "Delayed",
  [Quadrants.critical]: "Stalled"
};

export function getQuadrantName(cycleTime, latency, cycleTimeTarget, latencyTarget) {
  return QuadrantNames[getQuadrant(cycleTime, latency, cycleTimeTarget, latencyTarget)]
}


export function useCycleTimeLatencyHook(workItems) {
  const intl = useIntl();
  const seriesData = React.useMemo(() => {
    const pointsByState = workItems
      .filter((cycle) => cycle.workItemType !== "epic")
      .reduce((acc, item, index) => {
        const ageVal = projectDeliveryCycleFlowMetricsMeta["age"].value(item);
        if (acc[item.state] == null) {
          acc[item.state] = [ageVal];
        } else {
          acc[item.state] = [...acc[item.state], ageVal];
        }
        return acc;
      }, {});

    const seriesArr = Object.entries(pointsByState).map(([state, points]) => {
      return getHistogramSeries({
        id: state,
        intl,
        colWidthBoundaries: COL_WIDTH_BOUNDARIES,
        name: String(state).toLowerCase(),
        points,
      });
    });

    return seriesArr;
  }, [workItems, intl]);

  return seriesData;
}

export function getSubTitleForHistogram({workItems, specsOnly, intl}) {
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

export function getTitleForHistogram({workItems, specsOnly, stageName}) {
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

  return `Age Distribution: ${countDisplay} in ${stageName}`;
}