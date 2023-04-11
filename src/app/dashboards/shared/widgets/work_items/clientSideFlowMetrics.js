import {useIntl} from "react-intl";
import {daysFromNow, fromNow, toMoment} from "../../../../helpers/utility";
import {getPercentage} from "../../../projects/shared/helper/utils";
import {ALL_PHASES, FlowTypeStates, WorkItemStateTypes} from "../../config";

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