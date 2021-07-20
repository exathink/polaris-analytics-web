import React, {useState} from "react";
import {GroupingSelector} from "../../../../components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../charts/flowMetricCharts/flowMetricsScatterPlotChart";
import {Drawer, Select} from "antd";
import {Flex} from "reflexbox";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../helpers/metricsMeta";
import {FlowMetricsDetailTable} from "./flowMetricsDetailTable";
import {CardInspectorWidget} from "../../../../../work_items/cardInspector/cardInspectorWidget";
import {useChildState} from "../../../../../../helpers/hooksUtil";

const {Option} = Select;
export const DimensionDeliveryCyclesFlowMetricsView = ({
  instanceKey,
  context,
  model,
  days,
  targetMetrics,
  initialMetric,
  defectsOnly,
  specsOnly,
  hideControls,
  yAxisScale: parentYAxisScale,
  setYAxisScale: parentSetYAxisScale,
}) => {
  const groupings = specsOnly
    ? ["leadTime", "backlogTime", "cycleTime",  "duration", "effort", "latency" ]
    : ["leadTime", "cycleTime", "backlogTime"];
  const [selectedMetric, setSelectedMetric] = useState(initialMetric || "leadTime");

  const [metricTarget, targetConfidence] = projectDeliveryCycleFlowMetricsMeta.getTargetsAndConfidence(selectedMetric, targetMetrics)
  
  const [showPanel, setShowPanel] = React.useState(false);
  const [workItemKey, setWorkItemKey] = React.useState();

  const [yAxisScale, setYAxisScale] = useChildState(parentYAxisScale, parentSetYAxisScale, parentYAxisScale || 'logarithmic')

  React.useEffect(() => {
    initialMetric && setSelectedMetric(initialMetric);
  }, [initialMetric]);

  function selectMetricDropdown() {
    const optionElements = groupings.map((grouping, index) => (
      <Option key={grouping} value={index}>
        {projectDeliveryCycleFlowMetricsMeta[grouping].display}
      </Option>
    ));

    function handleDropdownChange(index) {
      const selectedMetric = groupings[index];
      setSelectedMetric(selectedMetric);
    }

    return (
      !hideControls &&
        <div style={{marginBottom: "5px"}}>
          <Select
            defaultValue={2}
            value={groupings.indexOf(selectedMetric)}
            style={{width: 170}}
            onChange={handleDropdownChange}
            getPopupContainer={(node) => node.parentNode}
            data-testid="groupings-select"
          >
            {optionElements}
          </Select>
        </div>
    );
  }

  return (
    <React.Fragment>
      <Flex w={0.95} justify={"space-between"}>
        {yAxisScale !== "table" && selectMetricDropdown()}
        {!defectsOnly &&  !hideControls && (
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
                  display: "Data",
                },
              ]}
              initialValue={yAxisScale}
              onGroupingChanged={setYAxisScale}
            />
          </div>
        )}
      </Flex>
      {yAxisScale !== "table" ? (
        <FlowMetricsScatterPlotChart
          days={days}
          model={model}
          selectedMetric={selectedMetric}
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
        <FlowMetricsDetailTable tableData={model} setShowPanel={setShowPanel} setWorkItemKey={setWorkItemKey} />
      )}
      {workItemKey && (
        <Drawer placement="top" height={355} closable={false} onClose={() => setShowPanel(false)} visible={showPanel}>
          <CardInspectorWidget context={context} workItemKey={workItemKey} />
        </Drawer>
      )}
    </React.Fragment>
  );
};
