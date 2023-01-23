import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";

import {useQueryDimensionPullRequestMetricsTrends} from "../../../../../projects/shared/hooks/useQueryDimensionPullRequestMetricsTrends";
import {PullRequestsCompletedTrendsView} from "./pullRequestsCompletedTrendsView";
import {PullRequestsCompletedTrendsDetailDashboard} from "./pullRequestsCompletedTrendsDetailDashboard";
import {toMoment} from "../../../../../../helpers/utility";

export const PullRequestsCompletedTrendsWidget = React.memo(({
  dimension,
  instanceKey,
  specsOnly,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
  latestCommit,
  setBefore
}) => {
  const {loading, error, data} = useQueryDimensionPullRequestMetricsTrends({
    dimension,
    instanceKey,
    specsOnly,
    days,
    measurementWindow,
    samplingFrequency,
    referenceString: latestCommit,
  });

  if (loading) return <Loading />;
  if (error) return null;
  const {pullRequestMetricsTrends} = data[dimension];

  return view === "primary" ? (
    <PullRequestsCompletedTrendsView
      pullRequestMetricsTrends={pullRequestMetricsTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      onSelectionChange={(items) => {
        if (items.length === 1) {
          const [{measurementDate}] = items;
          if (setBefore) {
            setBefore(toMoment(measurementDate));
          }
        }
      }}
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
});
