import {daysFromNow, diff_in_days, fromNow, toMoment} from "../../../../helpers/utility";

export function getWorkItemDurations(workItems) {
  return workItems.map(workItem => {
    const workItemStateDetails = workItem.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    const timeInState = daysFromNow(toMoment(latestTransitionDate));
    const timeSinceLatestCommit = workItemStateDetails.commitCount != null  ? daysFromNow(workItemStateDetails.latestCommit) : null;

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
      timeInState: timeInPriorStates,
      duration: workItemStateDetails.commitCount ? diff_in_days(workItemStateDetails.latestCommit, workItemStateDetails.earliestCommit) : null,
      latency: Math.min(timeInState, timeSinceLatestCommit || Number.MAX_VALUE),
      timeInStateDisplay: fromNow(latestTransitionDate),
      timeInPriorStates: timeInPriorStates,
      latestCommitDisplay: workItemStateDetails.latestCommit ? fromNow(workItemStateDetails.latestCommit) : null,
      cycleTime: timeInState + timeInPriorStates - timeInBacklog,
    }
  });
}