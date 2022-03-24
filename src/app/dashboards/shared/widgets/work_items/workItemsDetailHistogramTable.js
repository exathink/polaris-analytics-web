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
  series,
  stateType,
  chartSubTitle,
  selectedFilter,
  selectedMetric,
  onPointClick,
  clearFilters,
  specsOnly,
  tabSelection,
  tableData,
  colWidthBoundaries,
  setShowPanel,
  setWorkItemKey,
  resetComponentStateKey,
}) {
  return (
    <React.Fragment>
      <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>
        <WorkItemsDetailHistogramChart
          key={resetComponentStateKey}
          chartSubTitle={chartSubTitle}
          selectedMetric={selectedMetric}
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
            key={resetComponentStateKey}
            stateType={stateType}
            tableData={tableData}
            selectedMetric={getNormalizedMetricKey(selectedMetric)}
            selectedFilter={selectedFilter}
            setShowPanel={setShowPanel}
            setWorkItemKey={setWorkItemKey}
            colWidthBoundaries={colWidthBoundaries}
          />
        </div>
      )}
    </React.Fragment>
  );
}
