import {daysFromNow, diff_in_days, fromNow, toMoment} from "../../../../helpers/utility";

export function getWorkItemDurations(workItems) {
  return workItems.map(workItem => {
    const workItemStateDetails = workItem.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    const timeInState = daysFromNow(toMoment(latestTransitionDate));
    const timeSinceLatestCommit = workItemStateDetails.commitCount != null  ? daysFromNow(toMoment(workItemStateDetails.latestCommit)) : null;

    const timeInPriorStates = workItemStateDetails.currentDeliveryCycleDurations.reduce(
        (total, duration) => total + duration.daysInState
        , 0
      )
    const timeInBacklog = workItemStateDetails.currentDeliveryCycleDurations.filter(
      duration => duration.stateType === 'backlog'
    ).reduce(
        (total, duration) => total + duration.daysInState
        , 0
      )
    return {
      ...workItem,
      timeInState: timeInState,
      duration: workItemStateDetails.duration,
      effort: workItemStateDetails.effort,
      // We should never get negative values, but we sometimes do when the mesurement is made very close in time to the event,
      // so we are taking abs defensively, so that negative latencies dont show up in the UI. Yes, its a hack.
      latency: Math.abs(Math.min(timeInState, timeSinceLatestCommit || Number.MAX_VALUE)),
      timeInStateDisplay: fromNow(latestTransitionDate),
      timeInPriorStates: timeInPriorStates,
      latestCommitDisplay: workItemStateDetails.latestCommit ? fromNow(workItemStateDetails.latestCommit) : null,
      cycleTime: timeInState + timeInPriorStates - timeInBacklog,
    }
  });
}