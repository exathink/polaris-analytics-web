import React from "react";
import {useIntl} from "react-intl";
import {getServerDate, i18nDate, pick} from "../../../../../../helpers/utility";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {ClearFilters} from "../../../../components/clearFilters/clearFilters";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {WorkItemStateTypes} from "../../../../config";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
import {VolumeTrendsChart} from "./volumeTrendsChart";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

const WorkItemsTypeMap = {
  workItemsInScope: "all",
  workItemsWithCommits: "specs",
};

export function VolumeTrendsTableView({
  data,
  tableData,
  dimension,
  measurementPeriod,
  measurementWindow,
  chartConfig,
  view,
  context,
  before,
  setBefore,
}) {
    const tableData2 = React.useMemo(() => {
        const edgeNodes = tableData?.[dimension]?.workItemDeliveryCycles?.edges ?? [];
        return edgeNodes.map((edge) =>
          pick(
            edge.node,
            "id",
            "name",
            "key",
            "displayId",
            "workItemKey",
            "workItemType",
            "state",
            "stateType",
            "startDate",
            "endDate",
            "leadTime",
            "cycleTime",
            "latency",
            "duration",
            "effort",
            "authorCount",
            "teamNodeRefs",
            "epicName"
          )
        );
      }, [tableData, dimension]);
  const [tabSelection, setTab] = React.useState("histogram");
  const [workItemScope, setWorkItemScope] = React.useState("all");
  const specsOnly = workItemScope==="specs";
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  const intl = useIntl();

  const {cycleMetricsTrends: flowMetricsTrends} = data[dimension];
  return (
    <div className="tw-h-full tw-w-full">
      <div className="tw-ml-auto tw-flex tw-items-center">
        {before != null && (
          <div className="tw-mr-2">
            <ClearFilters
              selectedFilter={`${measurementWindow} days ending ${i18nDate(intl, getServerDate(before))}`}
              selectedMetric={`${specsOnly ? "Specs" : "Cards"} Closed`}
              stateType={WorkItemStateTypes.closed}
              handleClearClick={() => {
                setBefore?.(undefined);
              }}
            />
          </div>
        )}
        <GroupingSelector
          label={"View"}
          groupings={[
            {
              key: "histogram",
              display: "Histogram",
            },
            {
              key: "table",
              display: "Card Detail",
            },
          ]}
          initialValue={tabSelection}
          onGroupingChanged={setTab}
          layout="col"
        />
      </div>
      <div className={tabSelection === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>
        <VolumeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          chartConfig={chartConfig}
          view={view}
          onSelectionChange={(workItems) => {
            if (workItems.length === 1) {
              const [{measurementDate, key}] = workItems;
              if (setBefore && setWorkItemScope) {
                setBefore(getServerDate(measurementDate));
                setWorkItemScope(WorkItemsTypeMap[key]);
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
            stateType={"closed"}
            tableData={tableData2}
            setShowPanel={setShowPanel}
            setWorkItemKey={setWorkItemKey}
            colWidthBoundaries={COL_WIDTH_BOUNDARIES}
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
