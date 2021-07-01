import React from "react";
import {PullRequestsReviewTimeTrendsChart} from "./pullRequestsReviewTimeTrendsChart";
import {VizItem, VizRow} from "../../../../containers/layout";

export const PullRequestsReviewTimeTrendsView = ({
  pullRequestMetricsTrends,
  measurementPeriod,
  measurementWindow,
  view,
}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <PullRequestsReviewTimeTrendsChart
        pullRequestMetricsTrends={pullRequestMetricsTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        view={view}
      />
    </VizItem>
  </VizRow>
);
