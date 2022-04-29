import {useIntl} from "react-intl";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {PullRequestsDetailHistogramChart} from "../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
import {WorkItemStateTypes} from "../../../config";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function ClosedPullRequestsView({display, pullRequests}) {
  const intl = useIntl();
  if (display === "histogram") {
    const seriesAvgAge = getHistogramSeries({
      id: "pull-request",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      points: pullRequests.map((x) => x["age"]),
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
  } else {
    return null;
  }
}
