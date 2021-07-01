import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryProjectPullRequestMetricsTrends} from "../../../../../projects/shared/hooks/useQueryProjectPullRequestMetricsTrends";
import {PullRequestsReviewTimeTrendsView} from "./pullRequestsReviewTimeTrendsView";
import {PullRequestsReviewTimeTrendsDetailDashboard} from "./pullRequestsReviewTimeTrendsDetailDashboard";

export const PullRequestsReviewTimeTrendsWidget = ({
  instanceKey,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
  latestCommit,
}) => {
  const {loading, error, data} = useQueryProjectPullRequestMetricsTrends({
    instanceKey: instanceKey,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
    referenceString: latestCommit,
  });

  if (loading) return <Loading />;
  if (error) return null;
  const {pullRequestMetricsTrends} = data["project"];

  return view === "primary" ? (
    <PullRequestsReviewTimeTrendsView
      pullRequestMetricsTrends={pullRequestMetricsTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
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
};
