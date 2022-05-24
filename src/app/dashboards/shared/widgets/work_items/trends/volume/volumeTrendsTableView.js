import React from "react";
import {getServerDate} from "../../../../../../helpers/utility";
import { CardInspectorWithDrawer, useCardInspector } from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
import {VolumeTrendsChart} from "./volumeTrendsChart";

export function VolumeTrendsTableView({data, tableData, dimension, measurementPeriod, measurementWindow, chartConfig, view, context}) {
  const [before, setBefore] = React.useState();
  const [tabSelection, setTab] = React.useState("histogram");
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const {cycleMetricsTrends: flowMetricsTrends} = data[dimension];
  return (
    <div>
      <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>
        <VolumeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          chartConfig={chartConfig}
          view={view}
          onSelectionChange={({workItems}) => {
            if (workItems.length === 1) {
              const [{measurementDate, key}] = workItems;
              if (setBefore && setSeriesName) {
                setBefore(getServerDate(measurementDate));
                // setSeriesName(key);
                setTab?.("table");
              }
            }
          }}
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
