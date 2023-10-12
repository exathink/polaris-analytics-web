import React from "react";
import {WorkItemsDetailHistogramChart} from "../../charts/workItemCharts/workItemsDetailHistorgramChart";
import {WorkItemsDetailTable} from "./workItemsDetailTable";
import {defaultOnGridReady} from "../../../../components/tables/tableUtils";

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
  context,
  selectedFilter,
  tableData,
  tableSelectedMetric,
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
            context={context}
            selectedMetric={getNormalizedMetricKey(tableSelectedMetric)}
            selectedFilter={selectedFilter}
            colWidthBoundaries={colWidthBoundaries}
            specsOnly={specsOnly}
            paginationOptions={paginationOptions}
            onGridReady={(params) => {
              defaultOnGridReady(params);
              if(selectedFilter){
                params.api.setFilterModel({[getNormalizedMetricKey(tableSelectedMetric)]: {values: [selectedFilter]}});
              }

              if(tableSelectedMetric && tableData.length > 0){
                params.api.addCellRange({
                  rowStartIndex: 0,
                  rowEndIndex: tableData.length - 1,
                  columns: [getNormalizedMetricKey(tableSelectedMetric)],
                });
              }
            }}
          />
        </div>
      )}
    </React.Fragment>
  );
}
