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

function getRepoBrowseUrl(repoUrl, integrationType){
  if(repoUrl){
    if (repoUrl.startsWith('https://github.com')) {
      return [repoUrl.replace(/.git$/, ''), 'Github']
    } else if (repoUrl.startsWith('git@github.com')) {
      return [repoUrl.replace(/^git@github.com:/, 'https://github.com/').replace(/.git$/, ''), 'Github']
    } else if (repoUrl.startsWith('git@gitlab.com')) {
      return [repoUrl.replace(/^git@gitlab.com:/, 'https://gitlab.com/').replace(/.git$/, ''), 'Gitlab']
    } else if (integrationType === 'gitlab') {
      return [repoUrl.replace(/.git$/, ''), 'Gitlab']
    }
    else if (repoUrl.match(/https:\/\/(.*)@bitbucket.org/)) {
        return [repoUrl.replace(/.git$/,''), 'BitBucket']
    }
    else return [undefined, undefined]
  }
}

export function getCommitBrowseUrl(repoUrl, integrationType, commitHash) {
  if(commitHash && repoUrl) {
    const [repoBrowseUrl, source] = getRepoBrowseUrl(repoUrl, integrationType);
    if ('Github' === source || 'Gitlab' === source) {
      return [`${repoBrowseUrl}/commit/${commitHash}`, source]
    } else if('BitBucket' === source) {
      return [`${repoBrowseUrl}/commits/${commitHash}`, source]
    }
  }
  return [undefined, undefined]
}