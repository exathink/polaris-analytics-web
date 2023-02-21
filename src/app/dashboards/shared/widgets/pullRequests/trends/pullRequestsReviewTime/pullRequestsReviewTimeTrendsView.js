import React from "react";
import {PullRequestsReviewTimeTrendsChart} from "./pullRequestsReviewTimeTrendsChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {WorkItemStateTypes} from "../../../../config";
import {getHistogramSeries} from "../../../../../projects/shared/helper/utils";
import {useIntl} from "react-intl";
import {PullRequestsDetailHistogramChart} from "../../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
import classNames from "classnames";
import fontStyles from "../../../../../../framework/styles/fonts.module.css"
import { ClosedPullRequestCount, PullRequest } from "../../../../components/flowStatistics/flowStatistics";

const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];
export const PullRequestsReviewTimeTrendsView = ({
  pullRequestMetricsTrends,
  measurementPeriod,
  measurementWindow,
  view,
  display,
  onSelectionChange
}) => {

  const intl = useIntl();

  if (display === "reviewTimeAvgPRClosed") {
    const [currentTrend] = pullRequestMetricsTrends;
    return (
      <div className="tw-grid tw-h-full tw-grid-cols-2 tw-grid-rows-[auto_80%] tw-gap-1">
        <div className={classNames("tw-col-span-2 tw-font-normal", fontStyles["text-lg"])}>
          Closed Pull Requests
          <span className={classNames(fontStyles["text-xs"], "tw-ml-2")}>Last {measurementWindow} days</span>
        </div>
        <ClosedPullRequestCount title="Total" displayType="card" currentMeasurement={currentTrend} displayProps={{className: "tw-p-2"}} />
        <PullRequest title={"Time to Merge"} displayType="card" currentMeasurement={currentTrend} displayProps={{className: "tw-p-2"}} metric="avgAge" />
      </div>
    );
  }
  if (display === "histogram") {
    const seriesAvgAge = getHistogramSeries({
      id: "pull-request",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pullRequestMetricsTrends.map((x) => x["avgAge"]),
      name: "Pull Request Age",
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
        onSelectionChange={onSelectionChange}
      />
    </VizItem>
  </VizRow>
};
