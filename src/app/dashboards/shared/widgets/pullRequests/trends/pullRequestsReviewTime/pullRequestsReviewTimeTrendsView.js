import React from "react";
import {PullRequestsReviewTimeTrendsChart} from "./pullRequestsReviewTimeTrendsChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {WorkItemStateTypes} from "../../../../config";
import {getHistogramSeries} from "../../../../../projects/shared/helper/utils";
import {useIntl} from "react-intl";
import {PullRequestsDetailHistogramChart} from "../../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];
export const PullRequestsReviewTimeTrendsView = ({
  pullRequestMetricsTrends,
  measurementPeriod,
  measurementWindow,
  view,
  display
}) => {

  const intl = useIntl();
  if (display === "histogram") {
    const seriesAvgAge = getHistogramSeries({
      id: "pull-request",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pullRequestMetricsTrends.map((x) => x["avgAge"]),
      name: "Pull Request Age",
      color: "green",
      visible: true,
    });
    // show histogram view
    return (
      <PullRequestsDetailHistogramChart
        chartSubTitle={"Pull Request Avg Age"}
        selectedMetric={"pullRequestAvgAge"}
        specsOnly={true}
        colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        stateType={WorkItemStateTypes.closed}
        series={[seriesAvgAge]}
      />
    );
  }
  return <VizRow h={1}>
    <VizItem w={1}>
      <PullRequestsReviewTimeTrendsChart
        pullRequestMetricsTrends={pullRequestMetricsTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        view={view}
      />
    </VizItem>
  </VizRow>
};
