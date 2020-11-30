import React from "react";
import {PullRequestTrendsChart} from "./pullRequestTrendsChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";

export const ProjectPullRequestTrendsView = ({
  pullRequestMetricsTrends,
  measurementPeriod,
  measurementWindow,
  view,
}) => (
  <VizRow h={1}>
    <VizItem w={1}>
      <PullRequestTrendsChart
        pullRequestMetricsTrends={pullRequestMetricsTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        view={view}
      />
    </VizItem>
  </VizRow>
);
