import React from "react";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {projectDeliveryCycleFlowMetricsMeta,getSelectedMetricDisplayName} from "../../../../helpers/metricsMeta";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useChildState} from "../../../../../../helpers/hooksUtil";
import {getUniqItems, pick} from "../../../../../../helpers/utility";
import styles from "./flowMetrics.module.css";
import {SelectDropdown, useSelect} from "../../../../components/select/selectDropdown";
import {DeliveryCyclesHistogramChart} from "../../../../charts/flowMetricCharts/histogramChart";
import { WorkItemStateTypes } from "../../../../config";
import {WorkItemsDetailTable} from "../../workItemsDetailTable";
const COL_WIDTH_BOUNDARIES = [1, 3, 7, 14, 30, 60, 90];

export const DimensionDeliveryCyclesFlowMetricsView = ({
  instanceKey,
  context,
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

  const uniqueGroupings = groupings.map((g) => ({key: g, name: getSelectedMetricDisplayName(g, WorkItemStateTypes.closed)}));
  const _defaultMetric = {
    key: initialMetric || "leadTime",
    name: projectDeliveryCycleFlowMetricsMeta[initialMetric].display,
  };
  const {selectedVal: selectedMetric, setSelectedVal: setSelectedMetric, handleChange: handleMetricChange} = useSelect({
    uniqueItems: uniqueGroupings,
    defaultVal: _defaultMetric,
  });

  const [metricTarget, targetConfidence] = projectDeliveryCycleFlowMetricsMeta.getTargetsAndConfidence(
    selectedMetric.key,
    targetMetrics
  );

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const [yAxisScale, setYAxisScale] = useChildState(
    parentYAxisScale,
    parentSetYAxisScale,
    parentYAxisScale || "histogram"
  );

  React.useEffect(() => {
    initialMetric && setSelectedMetric(_defaultMetric);
    // eslint-disable-next-line
  }, [initialMetric]);

  function selectMetricDropdown() {
    return (
      !hideControls && (
        <SelectDropdown
          title="Metric"
          value={uniqueGroupings.map((x) => x.key).indexOf(selectedMetric.key)}
          uniqueItems={uniqueGroupings}
          handleChange={handleMetricChange}
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
      {yAxisScale === "histogram" ? (
        <DeliveryCyclesHistogramChart
          days={days}
          before={before}
          model={filteredData}
          selectedMetric={selectedMetric.key}
          metricsMeta={projectDeliveryCycleFlowMetricsMeta}
          metricTarget={metricTarget}
          targetConfidence={targetConfidence}
          defectsOnly={defectsOnly}
          specsOnly={specsOnly}
          yAxisScale={yAxisScale}
          colWidthBoundaries={COL_WIDTH_BOUNDARIES}
        />
      ) : (
        <WorkItemsDetailTable
          stateType="closed"
          tableData={filteredData}
          selectedMetric={selectedMetric.key}
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
