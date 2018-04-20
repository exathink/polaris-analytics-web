import moment from "moment/moment";

export const rollupActivitySummaries = (activitySummaryDetails) => {
  return activitySummaryDetails.reduce((totals, activitySummary) => {
    totals.commits = totals.commits + activitySummary.commit_count;
    totals.contributors = totals.contributors + activitySummary.contributor_count;
    if (activitySummary.earliest_commit.isBefore(totals.earliest_commit)) {
      totals.earliest_commit = activitySummary.earliest_commit;
    }
    if (activitySummary.latest_commit.isAfter(totals.latest_commit)) {
      totals.latest_commit = activitySummary.latest_commit
    }
    return totals;
  }, {
    commits: 0,
    contributors: 0,
    earliest_commit: activitySummaryDetails.length > 0 ? activitySummaryDetails[0].earliest_commit : moment(),
    latest_commit: activitySummaryDetails.length > 0 ? activitySummaryDetails[0].latest_commit : moment()
  });
}