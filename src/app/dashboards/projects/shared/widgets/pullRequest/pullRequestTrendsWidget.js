import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectPullRequestMetricsTrends} from "./useQueryProjectPullRequestMetricsTrends";
import {ProjectPullRequestTrendsView} from "./pullRequestTrendsView";
import {ProjectPullRequestTrendsDetailDashboard} from "./pullRequestTrendsDetailDashboard";

export const ProjectPullRequestTrendsWidget = ({
  instanceKey,
  view,
  context,
  days,
  measurementWindow,
  samplingFrequency,
}) => {
  const {loading, error, data} = useQueryProjectPullRequestMetricsTrends({
    instanceKey: instanceKey,
    days: days,
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency,
  });

  if (loading) return <Loading />;
  if (error) return null;
  const {pullRequestMetricsTrends} = data["project"];

  return view === "primary" ? (
    <ProjectPullRequestTrendsView
      pullRequestMetricsTrends={pullRequestMetricsTrends}
      measurementWindow={measurementWindow}
      measurementPeriod={days}
      view={view}
    />
  ) : (
    <ProjectPullRequestTrendsDetailDashboard
      instanceKey={instanceKey}
      pullRequestMetricsTrends={pullRequestMetricsTrends}
      measurementWindow={measurementWindow}
      days={days}
      samplingFrequency={samplingFrequency}
      view={view}
    />
  );
};
