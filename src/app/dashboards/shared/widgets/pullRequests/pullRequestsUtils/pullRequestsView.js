import classNames from "classnames";
import React from "react";
import {useIntl} from "react-intl";
import {i18nDate} from "../../../../../helpers/utility";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import {PullRequestsDetailHistogramChart} from "../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
import {ClearFilters} from "../../../components/clearFilters/clearFilters";
import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import {ResponseTimeMetricsColor} from "../../../config";
import {PullRequestsDetailTable} from "./pullRequestsDetailTable";

// Here we are passing all values in days format for consistency sake
// 1/48 days => 30mins, 6/24 days => 6 hours
const COL_WIDTH_BOUNDARIES = [1 / 48, 6 / 24, 1, 3, 7];

function getChartSubTitle({pullRequests, closedWithinDays, intl, before}) {
  if (closedWithinDays === 1 && pullRequests.length === 1) {
    return `${pullRequests.length} pull request closed on ${i18nDate(intl, before)}`;
  }
  if (closedWithinDays === 1 && pullRequests.length !== 1) {
    return `${pullRequests.length} pull requests closed on ${i18nDate(intl, before)}`;
  }
  if (closedWithinDays > 1 && pullRequests.length === 1) {
    return `${pullRequests.length} pull request closed within last ${closedWithinDays} days ending ${i18nDate(intl, before)}`;
  }
  return `${pullRequests.length} pull requests closed within last ${closedWithinDays} days ending${i18nDate(intl, before)}`;
}

function getSelectedFilterText({closedWithinDays, intl, before}) {
  if (closedWithinDays === 1) {
    return `on ${i18nDate(intl, before)}`;
  } else if (closedWithinDays > 1) {
    return `${closedWithinDays} days ending ${i18nDate(intl, before)}`;
  }
}

export function PullRequestsView({
  display,
  pullRequests,
  closedWithinDays,
  context,
  pullRequestsType,
  before,
  setBefore,
  selectedFilter,
  setFilter,
  displayBag={}
}) {
  const intl = useIntl();
  const {tabSelection, setTab} = displayBag;
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  // whenever selectedFilter changes, we want to remount table component
  React.useEffect(() => {
    if (selectedFilter) {
      resetComponentState();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  React.useEffect(() => {
    if (before) {
      setFilter(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [before]);

  const seriesAvgAge = React.useMemo(() => {
    return [
      getHistogramSeries({
        id: "pull-request",
        intl,
        colWidthBoundaries: COL_WIDTH_BOUNDARIES,
        points: pullRequests.map((x) => x["age"]),
        name: pullRequestsType === "closed" ? "Time to Review" : "Age",
        visible: true,
        color: ResponseTimeMetricsColor.duration,
      }),
    ];
  }, [pullRequests, pullRequestsType, intl]);

  function handleClearClick() {
    setFilter?.(null);
    resetComponentState();
  }

  const histogramChart = (
    <PullRequestsDetailHistogramChart
      title={pullRequestsType === "closed" ? `Review Time Details` : `Open Pull Requests`}
      chartSubTitle={
        pullRequestsType === "closed"
          ? getChartSubTitle({pullRequests, closedWithinDays, intl, before})
          : `Age Distribution`
      }
      selectedMetric={"pullRequestAvgAge"}
      colWidthBoundaries={COL_WIDTH_BOUNDARIES}
      series={seriesAvgAge}
      onPointClick={({category, selectedMetric}) => {
        setFilter?.(category);
        setTab?.("table");
      }}
    />
  );

  if (display === "histogram") {
    return histogramChart;
  }

  const pullRequestsTableView = (
    <div className="tw-relative tw-h-full">
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
  );

  let histogramTableElement, groupingSelector;
  if (display === "histogramTable") {
    groupingSelector = (
      <GroupingSelector
        label={"View"}
        className={"tw-ml-auto"}
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
        layout="row"
      />
    );

    histogramTableElement = (
      <React.Fragment>
        <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>{histogramChart}</div>
        {tabSelection === "table" && pullRequestsTableView}
      </React.Fragment>
    );
  }

  // show histogram view
  return (
    <div className="tw-h-full">
      <div className="tw-flex tw-items-center tw-justify-center">
        {before != null && (
          <div className="tw-mr-2">
            <ClearFilters
              selectedFilter={getSelectedFilterText({closedWithinDays, intl, before})}
              selectedMetric={"Closed Pull Requests"}
              stateType={pullRequestsType}
              handleClearClick={() => {
                setBefore?.(undefined);
                setTab?.("histogram");
              }}
            />
          </div>
        )}
        {pullRequestsType === "open" && (
          <div className="tw-mr-6">
            <ClearFilters
              selectedFilter={"As of today"}
              selectedMetric={"Open Pull Requests"}
              stateType={pullRequestsType}
              handleClearClick={handleClearClick}
            />
          </div>
        )}
        {display==="histogramTable" && <div className="dummy tw-flex-1"></div>}
        {selectedFilter != null && (
          <div className={classNames("tw-mr-6", display==="histogramTable" ? "tw-ml-auto": "")}>
            <ClearFilters
              selectedFilter={selectedFilter}
              selectedMetric={pullRequestsType === "open" ? "Open Pull Requests" : "pullRequestAvgAge"}
              stateType={pullRequestsType}
              handleClearClick={handleClearClick}
            />
          </div>
        )}
        {groupingSelector}
      </div>
      {histogramTableElement}
      {display === "table" && pullRequestsTableView}
      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </div>
  );
}
