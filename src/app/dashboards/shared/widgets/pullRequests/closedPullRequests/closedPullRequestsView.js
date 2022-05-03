import React from "react";
import {useIntl} from "react-intl";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {PullRequestsDetailHistogramChart} from "../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {ResponseTimeMetricsColor} from "../../../config";
import {PullRequestsDetailTable} from "./pullRequestsDetailTable";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function ClosedPullRequestsView({pullRequests, closedWithinDays}) {
  const intl = useIntl();
  const [tabSelection, setTab] = React.useState("histogram");
  const seriesAvgAge = getHistogramSeries({
    id: "pull-request",
    intl,
    colWidthBoundaries: COL_WIDTH_BOUNDARIES,
    points: pullRequests.map((x) => x["age"]),
    name: "Cycle Time",
    visible: true,
    color: ResponseTimeMetricsColor.duration,
  });
  // show histogram view
  return (
    <div className="tw-h-full">
      <div className="tw-flex tw-items-center tw-justify-end">
        <GroupingSelector
          label={"View"}
          className={"groupCardsBySelector"}
          groupings={[
            {key: "histogram", display: `Histogram`},
            {key: "table", display: "Card Detail"},
          ].map((item) => ({
            key: item.key,
            display: item.display,
          }))}
          initialValue={tabSelection}
          value={tabSelection}
          onGroupingChanged={setTab}
          layout="col"
        />
      </div>
      <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>
        <PullRequestsDetailHistogramChart
          chartSubTitle={`${pullRequests.length} pull requests closed within last ${closedWithinDays} days`}
          selectedMetric={"pullRequestAvgAge"}
          colWidthBoundaries={COL_WIDTH_BOUNDARIES}
          series={[seriesAvgAge]}
          onPointClick={({category, selectedMetric}) => {
            setTab("table");
          }}
        />
      </div>
      {tabSelection === "table" && (
        <div className="tw-h-full">
          <PullRequestsDetailTable tableData={pullRequests} colWidthBoundaries={COL_WIDTH_BOUNDARIES} />
        </div>
      )}
    </div>
  );
}
