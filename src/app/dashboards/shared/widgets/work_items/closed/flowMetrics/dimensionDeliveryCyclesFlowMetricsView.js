import React from "react";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {projectDeliveryCycleFlowMetricsMeta,getSelectedMetricDisplayName, getMetricsMetaKey, getSelectedMetricColor} from "../../../../helpers/metricsMeta";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useChildState} from "../../../../../../helpers/hooksUtil";
import {getUniqItems, pick} from "../../../../../../helpers/utility";
import styles from "./flowMetrics.module.css";
import {SelectDropdown, useSelect} from "../../../../components/select/selectDropdown";
import {WorkItemsDetailHistogramChart} from "../../../../charts/workItemCharts/workItemsDetailHistorgramChart";
import { WorkItemStateTypes } from "../../../../config";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
import {useResetComponentState} from "../../../../../projects/shared/helper/hooks";
import {getHistogramSeries} from "../../../../../projects/shared/helper/utils";
import {injectIntl} from "react-intl";
import {ClearFilterIcon} from "../../../../../../components/misc/customIcons";
import {Tag} from "antd";

const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

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
  yAxisScale: parentYAxisScale,
  setYAxisScale: parentSetYAxisScale,
}) => {
  const model = React.useMemo(
    () =>
      data[dimension].workItemDeliveryCycles.edges.map((edge) =>
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
          "epicName",
        )
      ),
    [data, dimension]
  );

  const groupings = specsOnly
    ? ["leadTime", "backlogTime", "cycleTime", "duration", "effort", "latency"]
    : ["leadTime", "cycleTime", "backlogTime"];

  const uniqueGroupings = groupings.map((g) => ({key: getMetricsMetaKey(g, WorkItemStateTypes.closed), name: getSelectedMetricDisplayName(g, WorkItemStateTypes.closed)}));
  const _defaultMetric = {
    key: getMetricsMetaKey(initialMetric, WorkItemStateTypes.closed) || "leadTime",
    name: projectDeliveryCycleFlowMetricsMeta[initialMetric].display,
  };
  const {selectedVal: selectedMetric, setSelectedVal: setSelectedMetric, handleChange: handleMetricChange} = useSelect({
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

  function selectMetricDropdown() {
    return (
      !hideControls && (
        <SelectDropdown
          title="Metric"
          value={uniqueGroupings.map((x) => x.key).indexOf(getMetricsMetaKey(selectedMetric.key, WorkItemStateTypes.closed))}
          uniqueItems={uniqueGroupings}
          handleChange={(index) => {
            setFilter(null);
            handleMetricChange(index);
          }}
          testId="groupings-select"
          width={170}
          className={styles.metricDropdown}
        />
      )
    );
  }

  const _defaultTeam = {key: "all", name: "All"};
  const uniqueTeams = [
    _defaultTeam,
    ...getUniqItems(
      model.flatMap((x) => x.teamNodeRefs),
      (x) => x.teamKey
    ).map((x) => ({key: x.teamKey, name: x.teamName})),
  ];
  const {selectedVal: selectedTeam, handleChange: handleTeamChange} = useSelect({
    uniqueItems: uniqueTeams,
    defaultVal: _defaultTeam,
  });

  const filteredData = React.useMemo(
    () =>
      model.filter((w) => {
        if (selectedTeam.key === _defaultTeam.key) {
          return true;
        } else {
          const _teams = w.teamNodeRefs.map((t) => t.teamName);
          return _teams.includes(selectedTeam.name);
        }
      }),
    [model, selectedTeam, _defaultTeam.key]
  );

 
  function getChartSeries() {
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
  }

  function getNormalizedMetricKey(selectedMetric) {
    return selectedMetric.key === "leadTime"
      ? "leadTimeOrAge"
      : selectedMetric.key === "cycleTime"
      ? "cycleTimeOrLatency"
      : selectedMetric.key;
  }

  return (
    <React.Fragment>
      <div className={styles.controls}>
        {yAxisScale !== "table" && (
          <SelectDropdown
            title={"Team"}
            value={uniqueTeams.map((x) => x.key).indexOf(selectedTeam.key)}
            uniqueItems={uniqueTeams}
            handleChange={handleTeamChange}
            testId="flowmetrics-team-dropdown"
            className={styles.teamDropdown}
          />
        )}
        {yAxisScale !== "table" && selectMetricDropdown()}
        {selectedFilter != null && (
          <div
            className="tw-ml-6 tw-flex tw-cursor-pointer tw-flex-col tw-justify-center tw-gap-1"
            title="Clear Filters"
            onClick={handleClearClick}
          >
            <div className="tw-textXs tw-flex tw-flex-row tw-items-start tw-gap-1">
              <div>
                <ClearFilterIcon
                  style={{color: getSelectedMetricColor(selectedMetric.key, WorkItemStateTypes.closed)}}
                />
              </div>
              <div>{getSelectedMetricDisplayName(selectedMetric.key, WorkItemStateTypes.closed)}</div>
            </div>
            <div className="tw-w-full">
              <Tag
                color={getSelectedMetricColor(selectedMetric.key, WorkItemStateTypes.closed)}
                className="tw-w-full tw-text-center"
              >
                {selectedFilter}
              </Tag>
            </div>
          </div>
        )}
        {!defectsOnly && !hideControls && (
          <div style={{marginLeft: "auto"}}>
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
            />
          </div>
        )}
      </div>

      <div className={yAxisScale === "table" ? "tw-hidden" : "tw-h-full tw-w-full"}>
        <WorkItemsDetailHistogramChart
          key={resetComponentStateKey}
          selectedMetric={selectedMetric.key}
          specsOnly={specsOnly}
          colWidthBoundaries={COL_WIDTH_BOUNDARIES}
          stateType={WorkItemStateTypes.closed}
          series={getChartSeries()}
          onPointClick={({category, selectedMetric}) => {
            setSelectedMetric({
              key: getMetricsMetaKey(selectedMetric, WorkItemStateTypes.closed),
              name: getSelectedMetricDisplayName(selectedMetric, WorkItemStateTypes.closed),
            });
            setFilter(category);
            setYAxisScale("table");
          }}
          clearFilters={resetFilterAndMetric}
        />
      </div>
      {yAxisScale === "table" && (
        <WorkItemsDetailTable
          key={resetComponentStateKey}
          stateType={WorkItemStateTypes.closed}
          tableData={filteredData}
          selectedMetric={getNormalizedMetricKey(selectedMetric)}
          selectedFilter={selectedFilter}
          setShowPanel={setShowPanel}
          setWorkItemKey={setWorkItemKey}
          colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        />
      )}

      <CardInspectorWithDrawer
        workItemKey={workItemKey}
        showPanel={showPanel}
        setShowPanel={setShowPanel}
        context={context}
      />
    </React.Fragment>
  );
};

export const DimensionDeliveryCyclesFlowMetricsView = injectIntl(DeliveryCyclesFlowMetricsView)