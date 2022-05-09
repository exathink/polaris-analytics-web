import React from "react";
import {useIntl} from "react-intl";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import {PullRequestsDetailHistogramChart} from "../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
import {ClearFilters} from "../../../components/clearFilters/clearFilters";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {ResponseTimeMetricsColor} from "../../../config";
import {PullRequestsDetailTable} from "./pullRequestsDetailTable";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export function PullRequestsView({pullRequests, closedWithinDays, context, pullRequestsType}) {
  const intl = useIntl();
  const [tabSelection, setTab] = React.useState("histogram");
  const [selectedFilter, setFilter] = React.useState(null);
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const seriesAvgAge = React.useMemo(() => {
    return [
      getHistogramSeries({
        id: "pull-request",
        intl,
        colWidthBoundaries: COL_WIDTH_BOUNDARIES,
        points: pullRequests.map((x) => x["age"]),
        name:"Time to Review",
        visible: true,
        color: ResponseTimeMetricsColor.duration,
      }),
    ];
  }, [pullRequests, intl]);

  function handleClearClick() {
    setFilter(null);
    resetComponentState();
  }
  // show histogram view
  return (
    <div className="tw-h-full">
      <div className="tw-flex tw-items-center tw-justify-end">
        {selectedFilter != null && (
          <div className="tw-mr-6">
            <ClearFilters
              selectedFilter={selectedFilter}
              selectedMetric={"pullRequestAvgAge"}
              stateType={pullRequestsType}
              handleClearClick={handleClearClick}
            />
          </div>
        )}
        <GroupingSelector
          label={"View"}
          className={"groupCardsBySelector"}
          groupings={[
            {key: "histogram", display: `Histogram`},
            {key: "table", display: "Pull Requests"},
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
          series={seriesAvgAge}
          onPointClick={({category, selectedMetric}) => {
            setFilter(category);
            setTab("table");
          }}
        />
      </div>
      {tabSelection === "table" && (
        <div className="tw-h-full">
          <PullRequestsDetailTable
            key={resetComponentStateKey}
            tableData={pullRequests}
            colWidthBoundaries={COL_WIDTH_BOUNDARIES}
            selectedFilter={selectedFilter}
            setShowPanel={setShowPanel}
            setWorkItemKey={setWorkItemKey}
            prStateType={pullRequestsType}
          />
        </div>
      )}
      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </div>
  );
}
