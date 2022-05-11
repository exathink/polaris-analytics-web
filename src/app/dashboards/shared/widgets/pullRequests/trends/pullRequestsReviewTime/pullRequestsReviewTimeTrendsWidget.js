import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryProjectPullRequestMetricsTrends} from "../../../../../projects/shared/hooks/useQueryProjectPullRequestMetricsTrends";
import {PullRequestsReviewTimeTrendsView} from "./pullRequestsReviewTimeTrendsView";
import {PullRequestsReviewTimeTrendsDetailDashboard} from "./pullRequestsReviewTimeTrendsDetailDashboard";
import {toMoment} from "../../../../../../helpers/utility";

export const PullRequestsReviewTimeTrendsWidget = React.memo(({
  dimension,
  instanceKey,
  view,
  display,
  context,
  days,
  measurementWindow,
  samplingFrequency,
  latestCommit,
  setBefore
}) => {
  const {loading, error, data} = useQueryProjectPullRequestMetricsTrends({
    dimension,
    instanceKey,
    days,
    measurementWindow,
    samplingFrequency,
    referenceString: latestCommit,
  });

  if (loading) return <Loading />;
  if (error) return null;
  const {pullRequestMetricsTrends} = data[dimension];

  return view === "primary" ? (
    <PullRequestsReviewTimeTrendsView
      pullRequestMetricsTrends={pullRequestMetricsTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
      display={display}
      onSelectionChange={(items) => {
        if (items.length === 1) {
          const [{measurementDate}] = items;
          if (setBefore) {
            setBefore(toMoment(measurementDate));
          }
        }
      }}
    />
  ) : (
    <PullRequestsReviewTimeTrendsDetailDashboard
      instanceKey={instanceKey}
      pullRequestMetricsTrends={pullRequestMetricsTrends}
      measurementWindow={measurementWindow}
      days={days}
      samplingFrequency={samplingFrequency}
      view={view}
      latestCommit={latestCommit}
    />
  );
});
