import {daysFromNow, fromNow, toMoment} from "../../../../helpers/utility";
import {WorkItemStateTypes} from "../../config";

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

export function getWorkItemDurations(workItems) {
  return workItems.map(workItem => {

    const [leadTime, cycleTime, timeInCurrentState] = getCycleMetrics(workItem);
    const workItemStateDetails = workItem.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    const timeSinceLatestCommit = workItemStateDetails.commitCount != null  ? Math.max(daysFromNow(toMoment(workItemStateDetails.latestCommit)), 0) : null;

    // This is the version of latency that records the time since the most recent progress event.
    const internalLatency = timeSinceLatestCommit != null ? Math.min(timeInCurrentState, timeSinceLatestCommit) : timeInCurrentState;

    return {
      ...workItem,
      timeInState: timeInCurrentState,
      duration: workItemStateDetails.duration,
      effort: workItemStateDetails.effort,
      commitCount: workItemStateDetails.commitCount,
      timeInStateDisplay: fromNow(latestTransitionDate),
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