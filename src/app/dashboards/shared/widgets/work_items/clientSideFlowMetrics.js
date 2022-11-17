import {daysFromNow, fromNow, toMoment} from "../../../../helpers/utility";
import {FlowTypeStates, WorkItemStateTypes} from "../../config";

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

export function getDeliveryCycleDurationsByState(workItems) {
  return workItems.reduce((acc, workItem) => {
    // delivery cycle durations, (each workItem has multiple durations, history of transitions)
    const durations = workItem.workItemStateDetails.currentDeliveryCycleDurations;
    for (const duration of durations) {
      // skip the below calculation for backlog entry of inprogress workItem, 
      if (workItem.stateType !== "closed" && duration.stateType === "backlog") {
        continue;
      }

      let daysInState = duration.daysInState ?? 0;

      // for duration.stateType === 'closed' , clock stops ticking
      // current state
      if (workItem.state === duration.state && duration.stateType !== "closed" && duration.daysInState == null) {
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

    return acc;
  }, {});
}

export function getTimeInActiveAndWaitStates(workItem) {
  const durations = workItem.workItemStateDetails.currentDeliveryCycleDurations;
  let timeInWaitState = 0;
  let timeInActiveState = 0;
  for (let i = 0; i < durations.length; i++) {
    if (durations[i].flowType === FlowTypeStates.WAITING) {
      timeInWaitState = timeInWaitState + durations[i].daysInState;
    }
    if (durations[i].flowType === FlowTypeStates.ACTIVE) {
      timeInActiveState = timeInActiveState + durations[i].daysInState;
    }
  }
  return {timeInWaitState, timeInActiveState};
}

export function getWorkItemDurations(workItems) {
  return workItems.map(workItem => {

    const [leadTime, cycleTime, timeInCurrentState] = getCycleMetrics(workItem);
    const workItemStateDetails = workItem.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    const timeSinceLatestCommit = workItemStateDetails.commitCount != null  ? Math.max(daysFromNow(toMoment(workItemStateDetails.latestCommit)), 0) : null;

    // This is the version of latency that records the time since the most recent progress event.
    const internalLatency = timeSinceLatestCommit != null ? Math.min(timeInCurrentState, timeSinceLatestCommit) : timeInCurrentState;
    const {timeInWaitState, timeInActiveState} = getTimeInActiveAndWaitStates(workItem);
    return {
      ...workItem,
      timeInWaitState,
      timeInActiveState,
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