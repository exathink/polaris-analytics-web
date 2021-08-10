import React from "react";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../charts/flowMetricCharts/flowMetricsScatterPlotChart";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../helpers/metricsMeta";
import {FlowMetricsDetailTable} from "./flowMetricsDetailTable";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {useChildState} from "../../../../../../helpers/hooksUtil";
import {getUniqItems, pick} from "../../../../../../helpers/utility";
import styles from "./flowMetrics.module.css";
import {SelectDropdown, useSelect} from "../../../../components/teams/selectTeam";

export const DimensionDeliveryCyclesFlowMetricsView = ({
  instanceKey,
  context,
  data,
  dimension,
  days,
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
          "startDate",
          "endDate",
          "leadTime",
          "cycleTime",
          "latency",
          "duration",
          "effort",
          "authorCount",
          "teamNodeRefs"
        )
      ),
    [data, dimension]
  );

  const groupings = specsOnly
    ? ["leadTime", "backlogTime", "cycleTime",  "duration", "effort", "latency" ]
    : ["leadTime", "cycleTime", "backlogTime"];

  const uniqueGroupings = groupings.map((g) => ({key: g, name: projectDeliveryCycleFlowMetricsMeta[g].display}));
  const _defaultMetric = {
    key: initialMetric || "leadTime",
    name: projectDeliveryCycleFlowMetricsMeta[initialMetric].display,
  };
  const {selectedVal: selectedMetric, setSelectedVal: setSelectedMetric, handleChange: handleMetricChange} = useSelect({
    uniqueItems: uniqueGroupings,
    defaultVal: _defaultMetric,
  });

  const [metricTarget, targetConfidence] = projectDeliveryCycleFlowMetricsMeta.getTargetsAndConfidence(selectedMetric.key, targetMetrics)
  
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  const [yAxisScale, setYAxisScale] = useChildState(parentYAxisScale, parentSetYAxisScale, parentYAxisScale || 'logarithmic')

  React.useEffect(() => {
    initialMetric && setSelectedMetric(_defaultMetric);
  }, [initialMetric]);

  function selectMetricDropdown() {
    return (
      !hideControls && (
        <SelectDropdown
          title="Metric"
          uniqueItems={uniqueGroupings}
          handleChange={handleMetricChange}
          testId="groupings-select"
          width={170}
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
        {yAxisScale !== "table" && selectMetricDropdown()}
        {yAxisScale !== "table" && (
          <SelectDropdown
            title={"Team"}
            uniqueItems={uniqueTeams}
            handleChange={handleTeamChange}
            testId="flowmetrics-team-dropdown"
            className={styles.teamDropdown}
          />
        )}
        {!defectsOnly && !hideControls && (
          <div style={{marginLeft: "auto"}}>
            <GroupingSelector
              label={"View"}
              value={yAxisScale}
              groupings={[
                {
                  key: "logarithmic",
                  display: "Normal",
                },
                {
                  key: "linear",
                  display: "Outlier",
                },
                {
                  key: "table",
                  display: "Table",
                },
              ]}
              initialValue={yAxisScale}
              onGroupingChanged={setYAxisScale}
            />
          </div>
        )}
      </div>
      {yAxisScale !== "table" ? (
        <FlowMetricsScatterPlotChart
          days={days}
          model={filteredData}
          selectedMetric={selectedMetric.key}
          metricsMeta={projectDeliveryCycleFlowMetricsMeta}
          metricTarget={metricTarget}
          targetConfidence={targetConfidence}
          defectsOnly={defectsOnly}
          specsOnly={specsOnly}
          yAxisScale={yAxisScale}
          onSelectionChange={(workItems) => {
            if (workItems.length === 1) {
              setShowPanel(true);
              setWorkItemKey(workItems[0].workItemKey);
            }
          }}
        />
      ) : (
        <FlowMetricsDetailTable
          tableData={filteredData}
          setShowPanel={setShowPanel}
          setWorkItemKey={setWorkItemKey}
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
