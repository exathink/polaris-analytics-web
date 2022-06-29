import React from "react";
import {useIntl} from "react-intl";
import {useResetComponentState} from "../../../../projects/shared/helper/hooks";
import {getHistogramSeries} from "../../../../projects/shared/helper/utils";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../work_items/cardInspector/cardInspectorUtils";
import {PullRequestsDetailHistogramChart} from "../../../charts/workItemCharts/pullRequestsDetailHistogramChart";
import {ClearFilters} from "../../../components/clearFilters/clearFilters";
import {ResponseTimeMetricsColor} from "../../../config";
import {PullRequestsDetailTable} from "./pullRequestsDetailTable";
import fontStyles from "../../../../../framework/styles/fonts.module.css";
import classNames from "classnames";

// Here we are passing all values in days format for consistency sake
// 1/48 days => 30mins, 6/24 days => 6 hours
const COL_WIDTH_BOUNDARIES = [1/48, 6/24, 1, 3, 7];

function getChartSubTitle({pullRequests, closedWithinDays, intl, before}) {
  if (closedWithinDays === 1 && pullRequests.length === 1) {
    return `${pullRequests.length} pull request closed on ${intl.formatDate(before)}`;
  }
  if (closedWithinDays === 1 && pullRequests.length !== 1) {
    return `${pullRequests.length} pull requests closed on ${intl.formatDate(before)}`;
  }
  if (closedWithinDays > 1 && pullRequests.length === 1) {
    return `${pullRequests.length} pull request closed within last ${closedWithinDays} days ending ${intl.formatDate(
      before
    )}`;
  }
  return `${pullRequests.length} pull requests closed within last ${closedWithinDays} days ending ${intl.formatDate(
    before
  )}`;
}

function getSelectedFilterText({closedWithinDays, intl, before}) {
  if (closedWithinDays === 1) {
    return `on ${intl.formatDate(before)}`;
  } else if (closedWithinDays > 1) {
    return `${closedWithinDays} days ending ${intl.formatDate(before)}`;
  }
}

export function PullRequestsView({display, pullRequests, closedWithinDays, context, pullRequestsType, before, setBefore, selectedFilter, setFilter}) {
  const intl = useIntl();

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
      setFilter(null)
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
        name: pullRequestsType === 'closed' ? "Time to Review" : "Age",
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
      title={
        pullRequestsType === "closed"
          ? `Review Time Variability`
          : `Open Pull Requests`
      }
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
      }}
    />
  );

  if (display==="histogram") {
    return histogramChart;
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
              }}
            />
          </div>
        )}
        {selectedFilter != null && (
          <div className="tw-mr-6">
            <ClearFilters
              selectedFilter={selectedFilter}
              selectedMetric={pullRequestsType === "open" ? "Open Pull Requests" : "pullRequestAvgAge"}
              stateType={pullRequestsType}
              handleClearClick={handleClearClick}
            />
          </div>
        )}
      </div>
      {display === "table" && (
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
