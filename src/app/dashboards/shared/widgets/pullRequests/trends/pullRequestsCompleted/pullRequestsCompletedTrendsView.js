import React from "react";
import {PullRequestsCompletedTrendsChart} from "./pullRequestsCompletedTrendsChart";
import {VizItem, VizRow} from "../../../../containers/layout";

export const PullRequestsCompletedTrendsView = ({
  pullRequestMetricsTrends,
  measurementPeriod,
  measurementWindow,
  view,
}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <PullRequestsCompletedTrendsChart
        pullRequestMetricsTrends={pullRequestMetricsTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        view={view}
      />
    </VizItem>
  </VizRow>
);
