import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryProjectPullRequestMetricsTrends} from "../../../../../projects/shared/hooks/useQueryProjectPullRequestMetricsTrends";
import {PullRequestsCompletedTrendsView} from "./pullRequestsCompletedTrendsView";
import {PullRequestsCompletedTrendsDetailDashboard} from "./pullRequestsCompletedTrendsDetailDashboard";

export const PullRequestsCompletedTrendsWidget = ({
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
    <PullRequestsCompletedTrendsView
      pullRequestMetricsTrends={pullRequestMetricsTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
    />
  ) : (
    <PullRequestsCompletedTrendsDetailDashboard
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
