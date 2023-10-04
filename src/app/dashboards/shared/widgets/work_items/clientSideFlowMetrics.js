import React from "react";
import { useIntl } from "react-intl";
import { average, daysFromNow, fromNow, i18nNumber, toMoment } from "../../../../helpers/utility";
import { getPercentage } from "../../../projects/shared/helper/utils";
import { ALL_PHASES, FlowTypeStates, WorkItemStateTypes } from "../../config";
import { Quadrants, getQuadrant, getQuadrantLegacy } from "./wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { useWipData } from "../../../../helpers/hooksUtil";

/* TODO: It is kind of messy that we  have to do this calculation here but
  *   it is probably the most straightfoward way to do it given that this is
  * a calc that only applies to the current delivery cycle
  * We are duplicating logic that is also done on the backend for closed cycles,
  * */
export function getCycleMetrics(workItem) {

  // Occasionally we get negative numbers due to clock drift when the event date is very close to the current
  // local time so we use the max calc to limit it to 0.
  const timeInCurrentState = Math.max(daysFromNow(toMoment(workItem.workItemStateDetails.currentStateTransition.eventDate)),0)

  if (workItem.stateType !== WorkItemStateTypes.closed) {
    const durations = workItem.workItemStateDetails.currentDeliveryCycleDurations;
    let leadTime = 0;
    let cycleTime = 0;
    for (let i = 0; i < durations.length; i++) {
      leadTime = leadTime + durations[i].daysInState;
      if (durations[i].stateType !== WorkItemStateTypes.backlog) {
        cycleTime = cycleTime + durations[i].daysInState;
      }
    }
    return [leadTime + timeInCurrentState, cycleTime + timeInCurrentState, timeInCurrentState]
  } else {
    // for closed work items we can get the correct cycle time from the back end.
    return [workItem.workItemStateDetails.leadTime, workItem.workItemStateDetails.cycleTime, timeInCurrentState]
  }
}

export function getDeliveryCycleDurationsByState(workItems, phases = ALL_PHASES) {
  const deliveryCycleDurationsByState = workItems.reduce((acc, workItem) => {
    // delivery cycle durations, (each workItem has multiple durations, history of transitions)
    const durations = workItem.workItemStateDetails.currentDeliveryCycleDurations;
    durations
      .filter((duration) => phases.includes(duration.stateType)) // filter out durations which don't belong to correct phase
      .forEach((duration) => {
        // skip the below calculation for backlog entry of inprogress workItem,
        if (workItem.stateType === "closed" || duration.stateType !== "backlog") {
          let daysInState = duration.daysInState ?? 0;

          // for duration.stateType === 'closed' , clock stops ticking
          // current state
          if (workItem.state === duration.state && duration.stateType !== "closed") {
            daysInState =
              daysInState + daysFromNow(toMoment(workItem.workItemStateDetails.currentStateTransition.eventDate));
          }

          if (acc[duration.state] != null) {
            acc[duration.state].daysInState += daysInState;
          } else {
            acc[duration.state] = {
              stateType: duration.stateType,
              flowType: duration.flowType,
              daysInState: daysInState,
            };
          }
        }
      });

    return acc;
  }, {});

  return deliveryCycleDurationsByState;
}

export function getTimeInActiveAndWaitStates(workItems, phases = ALL_PHASES) {
  const deliveryCycleDurationsByState = getDeliveryCycleDurationsByState(workItems, phases);
  let timeInWaitState = 0;
  let timeInActiveState = 0;
  Object.entries(deliveryCycleDurationsByState).forEach(([_state, entry]) => {
    if (entry.flowType === FlowTypeStates.WAITING) {
      timeInWaitState = timeInWaitState + entry.daysInState;
    }
    if (entry.flowType === FlowTypeStates.ACTIVE) {
      timeInActiveState = timeInActiveState + entry.daysInState;
    }
  });

  return {timeInActiveState, timeInWaitState};
}

export function getAverageTimeInState(workItems, aggregateDurations, state) {
  return workItems.length > 0 ? aggregateDurations[state].daysInState / (workItems.length) : 0;
}

export function getFlowEfficiencyFraction(workItems, phases = ALL_PHASES) {
  const {timeInActiveState, timeInWaitState} = getTimeInActiveAndWaitStates(workItems, phases);
  const flowEfficiencyFraction =
    timeInWaitState + timeInActiveState !== 0 ? timeInActiveState / (timeInWaitState + timeInActiveState) : 0;

  return flowEfficiencyFraction;
}

export function useFlowEfficiency(workItems, phases = ALL_PHASES) {
  const flowEfficiencyFraction = getFlowEfficiencyFraction(workItems, phases);

  const intl = useIntl();
  return getPercentage(flowEfficiencyFraction, intl);
}

export function getQuadrantCounts({ workItems, cycleTimeTarget, latencyTarget }) {
  return workItems.reduce((acc, item) => {
    const quadrant = getQuadrantLegacy(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (acc[quadrant]) {
      acc[quadrant] += 1;
    } else {
      acc[quadrant] = 1;
    }
    return acc;
  }, {});
}

function getWorkInMotion(workItems, latencyTarget) {
  return workItems.length > 0 ? workItems.filter(workItem => workItem.latency < latencyTarget).length: 0
}

export function useMotionEfficiency(workItems, latencyTarget) {
  const workInMotion = getWorkInMotion(workItems, latencyTarget);
  const intl = useIntl();
  if (workInMotion > 0) {
    return [workInMotion, getPercentage(workInMotion/workItems.length, intl)]
  } else {
    return [0, 'None']
  }
}

function getCurrentFlowType(workItemStateDetails, currentState) {
  return workItemStateDetails.currentDeliveryCycleDurations.find(d => d.state === currentState)?.flowType
}

export function getWorkItemDurations(workItems) {
  return workItems.map(workItem => {

    const [leadTime, cycleTime, timeInCurrentState] = getCycleMetrics(workItem);
    const workItemStateDetails = workItem.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    const timeSinceLatestCommit = workItemStateDetails.commitCount != null  ? Math.max(daysFromNow(toMoment(workItemStateDetails.latestCommit)), 0) : null;
    const flowType = getCurrentFlowType(workItemStateDetails, workItem.state)
    // This is the version of latency that records the time since the most recent progress event.
    const internalLatency = timeSinceLatestCommit != null ? Math.min(timeInCurrentState, timeSinceLatestCommit) : timeInCurrentState;

    return {
      ...workItem,
      flowType:flowType,
      timeInState: timeInCurrentState,
      duration: workItemStateDetails.duration,
      effort: workItemStateDetails.effort,
      endDate: workItemStateDetails.endDate,
      commitCount: workItemStateDetails.commitCount,
      timeInStateDisplay: fromNow(latestTransitionDate),
      latestCommit: workItemStateDetails.latestCommit,
      latestCommitDisplay: workItemStateDetails.latestCommit ? fromNow(workItemStateDetails.latestCommit) : null,
      latestTransitionDate: workItemStateDetails.currentStateTransition.eventDate,
      cycleTime: cycleTime,
      leadTime: leadTime,
      latency: internalLatency,
      // the server side latency avg returns commit latency for specs
      // and null for non-specs. This number matches for specs, but not for non-specs.
      // Our averages are for specs, so this should be ok to use as such and more meaningful for non-specs.
      commitLatency: timeSinceLatestCommit || timeInCurrentState,
    }
  });
}


export function getWipLimit({flowMetricsData, dimension, specsOnly, intl, cycleTimeTarget, days}) {
  const {contributorCount=0} = flowMetricsData[dimension];
  const utilizationBasedLimit = contributorCount*1.2

  const cycleMetricsTrend = flowMetricsData[dimension]["cycleMetricsTrends"][0]
  const flowItems = cycleMetricsTrend?.[specsOnly ? "workItemsWithCommits" : "workItemsInScope"] ?? 0;
  const throughputRate = flowItems / days;
  const idealAverageWip = throughputRate * cycleTimeTarget

  let targetWip = null;
  if (utilizationBasedLimit > 0 && idealAverageWip > 0) {
     targetWip = i18nNumber(intl, Math.round(Math.min(idealAverageWip, utilizationBasedLimit)), 0);
  } else if (utilizationBasedLimit > 0) {
    targetWip = i18nNumber(intl, Math.round(utilizationBasedLimit), 0);
  } else if (idealAverageWip > 0) {
    targetWip = i18nNumber(intl, Math.round(idealAverageWip), 0);
  }
  return i18nNumber(intl, targetWip, 0);
}


export function useWipMetricsCommon({
  wipDataAll,
  flowMetricsData,
  dimension,
  specsOnly,
  days,
  excludeAbandoned,
  cycleTimeTarget,
  latencyTarget,
}) {
  const intl = useIntl();
  const {wipWorkItems, wipSpecsWorkItems} = useWipData({wipDataAll, specsOnly: specsOnly, dimension});

  const workItemsDurations = getWorkItemDurations(wipWorkItems);
  const workItemAggregateDurations = excludeAbandoned
    ? workItemsDurations.filter(
        (w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) !== Quadrants.abandoned
      )
    : workItemsDurations;

  const motionLimit = workItemsDurations.filter(
    (w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) === Quadrants.ok
  )

  const workItemAggregateDurationsForSpecs = excludeAbandoned
    ? getWorkItemDurations(wipSpecsWorkItems).filter(
        (w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) !== Quadrants.abandoned
      )
    : getWorkItemDurations(wipSpecsWorkItems);

  const avgCycleTime = average(workItemAggregateDurations, (item) => item.cycleTime);

  const pipelineCycleMetrics = {
    [specsOnly ? "workItemsWithCommits" : "workItemsInScope"]: workItemAggregateDurations.length,
    avgCycleTime: i18nNumber(intl, avgCycleTime, 2),
  };

  const wipLimit = getWipLimit({flowMetricsData, dimension, specsOnly, intl, cycleTimeTarget, days});

  return {wipLimit, motionLimit, pipelineCycleMetrics, workItemAggregateDurations, workItemAggregateDurationsForSpecs};
}

export function DevItemRatio({devItemsCount, devItemsPercentage}) {
  return (
    <div className="tw-textXl tw-flex tw-flex-col">
      <div className="tw-flex tw-items-center tw-gap-2">
        <div>{devItemsCount}</div>
        <div className="tw-textSm">{devItemsCount===1 ? "Dev Item": "Dev Items"}</div>
      </div>
      <div className="tw-flex tw-items-center tw-gap-2">
        <div className="tw-textSm">Ratio</div>
        <div className="tw-textSm tw-font-medium">{devItemsPercentage}</div>
      </div>
    </div>
  );
}