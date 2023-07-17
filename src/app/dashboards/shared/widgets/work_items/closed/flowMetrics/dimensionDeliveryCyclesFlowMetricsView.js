import React from "react";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {
  projectDeliveryCycleFlowMetricsMeta,
  getSelectedMetricDisplayName,
  getMetricsMetaKey,
  getSelectedMetricColor,
} from "../../../../helpers/metricsMeta";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useChildState} from "../../../../../../helpers/hooksUtil";
import {pick} from "../../../../../../helpers/utility";
import {useSelect} from "../../../../components/select/selectDropdown";
import {AppTerms, WorkItemStateTypes} from "../../../../config";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {getHistogramSeries, getTimePeriod} from "../../../../../projects/shared/helper/utils";
import {injectIntl, useIntl} from "react-intl";
import {WorkItemsDetailHistogramTable} from "../../workItemsDetailHistogramTable";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";

const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

function getChartSubTitle({filteredData, defectsOnly, specsOnly, days, before, selectedMetric}) {
  const candidateCycles = filteredData.filter((cycle) => cycle.workItemType !== "epic");
  const workItemsWithNullCycleTime = candidateCycles.filter((x) => !Boolean(x.cycleTime)).length;
  const subTitle = defectsOnly
    ? `${candidateCycles.length} Defects closed: ${getTimePeriod(days, before)}`
    : ` ${candidateCycles.length} ${specsOnly ? AppTerms.specs.display : AppTerms.cards.display} closed: ${getTimePeriod(days, before)}`;
  // When showing cycle time we also report total with no cycle time if they exist.
  return selectedMetric === "cycleTime" && workItemsWithNullCycleTime > 0
    ? `${subTitle} (${workItemsWithNullCycleTime} with no cycle time)`
    : subTitle;
}

const DeliveryCyclesFlowMetricsView = ({
  instanceKey,
  context,
  intl,
  data,
  dimension,
  days,
  before,
  targetMetrics,
  initialMetric,
  defectsOnly,
  specsOnly,
  hideControls,
  chartOrTable,
  yAxisScale: parentYAxisScale,
  setYAxisScale: parentSetYAxisScale,
  view,
  displayBag={}
}) => {
  const model = React.useMemo(
    () =>
      data[dimension].workItemDeliveryCycles.edges.map((edge) =>
        pick(
          edge.node,
          "id",
          "name",
          "url",
          "tags",
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
          "epicName",
          "workItemsSourceName",
          "workTrackingIntegrationType"
        )
      ),
    [data, dimension]
  );

  const groupings = specsOnly
    ? ["leadTime", "backlogTime", "cycleTime", "duration", "effort", "latency", "pullRequestAvgAge"]
    : ["leadTime", "cycleTime", "backlogTime"];

  const uniqueGroupings = groupings.map((g) => ({
    key: getMetricsMetaKey(g, WorkItemStateTypes.closed),
    name: getSelectedMetricDisplayName(g, WorkItemStateTypes.closed),
  }));
  const _defaultMetric = {
    key: getMetricsMetaKey(initialMetric, WorkItemStateTypes.closed) || "leadTime",
    name: projectDeliveryCycleFlowMetricsMeta[initialMetric].display,
  };
  const {
    selectedVal: selectedMetric,
    setSelectedVal: setSelectedMetric,
  } = useSelect({
    uniqueItems: uniqueGroupings,
    defaultVal: _defaultMetric,
  });

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const [yAxisScale, setYAxisScale] = useChildState(
    parentYAxisScale,
    parentSetYAxisScale,
    parentYAxisScale || "histogram"
  );

  const [selectedFilter, setFilter] = React.useState(null);
  const [resetComponentStateKey, resetComponentState] = useResetComponentState();
  function resetFilterAndMetric() {
    setFilter(null);
    setSelectedMetric(_defaultMetric);
  }

  function handleClearClick() {
    setYAxisScale("histogram");
    resetFilterAndMetric();
    resetComponentState();
  }

  React.useEffect(() => {
    if (initialMetric) {
      handleClearClick();
    }
    // eslint-disable-next-line
  }, [initialMetric]);

  const filteredData = model;

  const seriesData = React.useMemo(() => {
    const points = filteredData
      .filter((cycle) => cycle.workItemType !== "epic")
      .map((cycle) => projectDeliveryCycleFlowMetricsMeta[selectedMetric.key].value(cycle));

    const seriesObj = getHistogramSeries({
      id: selectedMetric.key,
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      name: getSelectedMetricDisplayName(selectedMetric.key, WorkItemStateTypes.closed),
      points,
      color: getSelectedMetricColor(selectedMetric.key, WorkItemStateTypes.closed),
    });

    return [seriesObj];
  }, [filteredData, selectedMetric.key, intl]);

  return (
    <div className="tw-h-full">
      {chartOrTable === undefined && (
        <div className="tw-flex tw-h-[60px] tw-items-center">
          {!defectsOnly && !hideControls && (
            <div className="tw-ml-auto tw-flex tw-items-center">
              <GroupingSelector
                label={"View"}
                value={yAxisScale}
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
                initialValue={yAxisScale}
                onGroupingChanged={setYAxisScale}
                layout="col"
              />
            </div>
          )}
        </div>
      )}

      <WorkItemsDetailHistogramTable
        // common props
        key={resetComponentStateKey}
        stateType={WorkItemStateTypes.closed}
        tabSelection={chartOrTable === "table" ? "table" : yAxisScale}
        colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        // chart props
        chartSubTitle={getChartSubTitle({filteredData, defectsOnly, specsOnly, days, before, selectedMetric})}
        chartSelectedMetric={selectedMetric.key}
        specsOnly={specsOnly}
        series={seriesData}
        onPointClick={({category, selectedMetric}) => {
          setSelectedMetric({
            key: getMetricsMetaKey(selectedMetric, WorkItemStateTypes.closed),
            name: getSelectedMetricDisplayName(selectedMetric, WorkItemStateTypes.closed),
          });
          setFilter(category);
          setYAxisScale("table");
        }}
        clearFilters={resetFilterAndMetric}
        // table props
        view={view}
        selectedFilter={selectedFilter}
        tableData={filteredData}
        tableSelectedMetric={selectedMetric.key}
        setShowPanel={setShowPanel}
        setWorkItemKey={setWorkItemKey}
      />

      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </div>
  );
};

export function DimensionCycleTimeHistogramView({data, dimension, specsOnly, days, before}) {
  const intl = useIntl();
  const model = data[dimension].workItemDeliveryCycles.edges.map((edge) =>
    pick(
      edge.node,
      "id",
      "name",
      "url",
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

  const seriesData = React.useMemo(() => {
    const points = model
      .filter((cycle) => cycle.workItemType !== "epic")
      .map((cycle) => projectDeliveryCycleFlowMetricsMeta["cycleTime"].value(cycle));

    const seriesObj = getHistogramSeries({
      id: "cycleTime",
      intl,
      colWidthBoundaries: COL_WIDTH_BOUNDARIES,
      name: getSelectedMetricDisplayName("cycleTime", WorkItemStateTypes.closed),
      points,
      color: getSelectedMetricColor("cycleTime", WorkItemStateTypes.closed),
    });

    return [seriesObj];
  }, [model, intl]);

  return (
    <WorkItemsDetailHistogramChart
      chartConfig={{
        subtitle: getChartSubTitle({
          filteredData: model,
          defectsOnly: false,
          specsOnly: specsOnly,
          days: days,
          before: before,
          selectedMetric: "cycleTime",
        }),
      }}
      selectedMetric={"cycleTime"}
      specsOnly={specsOnly}
      colWidthBoundaries={COL_WIDTH_BOUNDARIES}
      stateType={"closed"}
      series={seriesData}
    />
  );
}

export const DimensionDeliveryCyclesFlowMetricsView = injectIntl(DeliveryCyclesFlowMetricsView);
