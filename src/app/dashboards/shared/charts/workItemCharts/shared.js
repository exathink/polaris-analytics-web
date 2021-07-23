import {daysFromNow, fromNow, toMoment} from "../../../../helpers/utility";
import {WorkItemStateTypes} from "../../config";

export function getWorkItemDurations(workItems) {
  return workItems.map(workItem => {
    const workItemStateDetails = workItem.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    // We do this to account for occassional negative values that arise due to clock drift between
    // server and local time when the latest update date is very close to now.
    const timeInState = Math.max(daysFromNow(toMoment(latestTransitionDate)), 0);
    const timeSinceLatestCommit = workItemStateDetails.commitCount != null  ? Math.max(daysFromNow(toMoment(workItemStateDetails.latestCommit)), 0) : null;

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
    // for closed items latency is 0 by definition. Otherwise for specs we use time since last commit and for non-specs we use time since last state transition.
    const latency = workItem.stateType !== WorkItemStateTypes.closed ? timeSinceLatestCommit || timeInState : 0
    return {
      ...workItem,
      timeInState: timeInState,
      duration: workItemStateDetails.duration,
      effort: workItemStateDetails.effort,
      commitCount: workItemStateDetails.commitCount,
      latency: latency,
      timeInStateDisplay: fromNow(latestTransitionDate),
      timeInPriorStates: timeInPriorStates,
      latestCommitDisplay: workItemStateDetails.latestCommit ? fromNow(workItemStateDetails.latestCommit) : null,
      cycleTime: timeInState + timeInPriorStates - timeInBacklog,
      leadTime: timeInState + timeInPriorStates
    }
  });
}