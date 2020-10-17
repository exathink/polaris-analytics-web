import {daysFromNow, diff_in_days, fromNow, toMoment} from "../../../../helpers/utility";

export function getWorkItemDurations(workItems) {
  return workItems.map(workItem => {
    const workItemStateDetails = workItem.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    const timeInState = daysFromNow(toMoment(latestTransitionDate));
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
      latency: workItemStateDetails.commitCount ? daysFromNow(workItemStateDetails.latestCommit) : null,
      timeInStateDisplay: fromNow(latestTransitionDate),
      timeInPriorStates: timeInPriorStates,
      cycleTime: timeInState + timeInPriorStates - timeInBacklog,
    }
  });
}