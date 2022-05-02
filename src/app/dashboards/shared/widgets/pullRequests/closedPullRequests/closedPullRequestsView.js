import {useIntl} from "react-intl";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {PullRequestsDetailHistogramChart} from "../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
import {ResponseTimeMetricsColor} from "../../../config";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function ClosedPullRequestsView({pullRequests, closedWithinDays}) {
  const intl = useIntl();
  const seriesAvgAge = getHistogramSeries({
    id: "pull-request",
    intl,
    colWidthBoundaries: COL_WIDTH_BOUNDARIES,
    points: pullRequests.map((x) => x["age"]),
    name: "Cycle Time",
    visible: true,
    color: ResponseTimeMetricsColor.duration
  });
  // show histogram view
  return (
    <PullRequestsDetailHistogramChart
      chartSubTitle={`${pullRequests.length} pull requests closed within last ${closedWithinDays} days`}
      selectedMetric={"pullRequestAvgAge"}
      colWidthBoundaries={COL_WIDTH_BOUNDARIES}
      series={[seriesAvgAge]}
    />
  );
}
