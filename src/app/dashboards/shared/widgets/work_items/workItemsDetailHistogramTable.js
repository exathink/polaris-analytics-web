import React from "react";
import {WorkItemsDetailHistogramChart} from "../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {WorkItemsDetailTable} from "./workItemsDetailTable";

function getNormalizedMetricKey(selectedMetric) {
  return selectedMetric === "leadTime"
    ? "leadTimeOrAge"
    : selectedMetric === "cycleTime"
    ? "cycleTimeOrLatency"
    : selectedMetric;
}

export function WorkItemsDetailHistogramTable({
  // common props
  stateType,
  tabSelection,
  colWidthBoundaries,
  // chart props
  chartSubTitle,
  chartSelectedMetric,
  specsOnly,
  series,
  onPointClick,
  clearFilters,
  // table props
  view,
  selectedFilter,
  tableData,
  tableSelectedMetric,
  setShowPanel,
  setWorkItemKey,
  paginationOptions
}) {
  return (
    <React.Fragment>
      <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>
        <WorkItemsDetailHistogramChart
          chartConfig={{subtitle: chartSubTitle}}
          selectedMetric={chartSelectedMetric}
          specsOnly={specsOnly}
          colWidthBoundaries={colWidthBoundaries}
          stateType={stateType}
          series={series}
          onPointClick={onPointClick}
          clearFilters={clearFilters}
        />
      </div>
      {tabSelection === "table" && (
        <div className="tw-h-full tw-w-full">
          <WorkItemsDetailTable
            view={view}
            stateType={stateType}
            tableData={tableData}
            selectedMetric={getNormalizedMetricKey(tableSelectedMetric)}
            selectedFilter={selectedFilter}
            setShowPanel={setShowPanel}
            setWorkItemKey={setWorkItemKey}
            colWidthBoundaries={colWidthBoundaries}
            specsOnly={specsOnly}
            paginationOptions={paginationOptions}
          />
        </div>
      )}
    </React.Fragment>
  );
}
