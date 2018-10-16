import  {getActivityLevel} from "./activityLevel";
import {toMoment} from "../../../helpers/utility";
import moment from "moment";

export function getDaysSinceCommit(serverCommitDate) {
  return moment().utc().diff(toMoment(serverCommitDate), 'days')
}
export function findActivityLevel(serverLatestCommitDate) {
  return serverLatestCommitDate ?  getActivityLevel({
    days_since_latest_commit: getDaysSinceCommit(serverLatestCommitDate)
  }) : null;
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