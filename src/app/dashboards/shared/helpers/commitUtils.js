import {getActivityLevel, ACTIVITY_LEVEL_INITIAL} from "./activityLevel";
import {toMoment} from "../../../helpers/utility";
import moment from "moment";

export function getDaysSinceCommit(serverCommitDate) {
  return moment().utc().diff(toMoment(serverCommitDate), 'days')
}
export function findActivityLevel(serverLatestCommitDate) {
  return serverLatestCommitDate ?  getActivityLevel({
    days_since_latest_commit: getDaysSinceCommit(serverLatestCommitDate)
  }) : ACTIVITY_LEVEL_INITIAL;
}

export function getTimelineRefreshInterval(serverLatestCommitDate) {
  const daysSinceLatestCommit  = getDaysSinceCommit(serverLatestCommitDate)
  return (
    daysSinceLatestCommit < 7 ? 60*1000 : (
      daysSinceLatestCommit <= 3 ? 5*60*1000 :
        10*60*1000
    )
  )
}

export function queueTime(commit) {
  return moment.duration(toMoment(commit.commitDate).diff(toMoment(commit.authorDate))).humanize();
}