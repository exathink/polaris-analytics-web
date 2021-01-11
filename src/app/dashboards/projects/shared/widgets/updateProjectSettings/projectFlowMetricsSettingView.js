import React from "react";
import {GroupingSelector} from "../../../../shared/components/groupingSelector/groupingSelector";
import {FlowMetricsScatterPlotChart} from "../../../../shared/charts/flowMetricCharts/flowMetricsScatterPlotChart";
import WorkItems from "../../../../work_items/context";
import {Flex} from "reflexbox";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../../shared/helpers/metricsMeta";
import {METRICS, actionTypes, mode} from "./constants";
import {settingsReducer} from "./settingsReducer";
import {TargetControlBarSliders} from "./TargetControlBarSliders";

export const ProjectFlowMetricsSettingView = ({
  instanceKey,
  context,
  model,
  days,
  projectCycleMetrics,
  defectsOnly,
  specsOnly,
}) => {
  const groupings = [METRICS.LEAD_TIME, METRICS.CYCLE_TIME];
  const initialState = {
    selectedMetric: METRICS.LEAD_TIME,
    leadTime: {
      target: projectCycleMetrics.leadTimeTarget,
      confidence: projectCycleMetrics.leadTimeConfidenceTarget,
      initialTarget: projectCycleMetrics.leadTimeTarget,
      initialConfidence: projectCycleMetrics.leadTimeConfidenceTarget,
      mode: mode.INIT,
    },
    cycleTime: {
      target: projectCycleMetrics.cycleTimeTarget,
      confidence: projectCycleMetrics.cycleTimeConfidenceTarget,
      initialTarget: projectCycleMetrics.cycleTimeTarget,
      initialConfidence: projectCycleMetrics.cycleTimeConfidenceTarget,
      mode: mode.INIT,
    },
  };
  const [state, dispatch] = React.useReducer(settingsReducer, initialState);

  // state for sliders
  const targetControlBarState = {
    leadTime: state.leadTime,
    cycleTime: state.cycleTime,
    selectedMetric: state.selectedMetric,
    dispatch,
  };

  const {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget} = projectCycleMetrics;
  // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: actionTypes.UPDATE_DEFAULTS,
      payload: {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget},
    });
  }, [leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget]);

  return (
    <React.Fragment>
      <TargetControlBarSliders targetControlBarState={targetControlBarState} projectKey={instanceKey} />
      <Flex w={0.95} justify={"center"}>
        <GroupingSelector
          label={" "}
          groupings={groupings.map((grouping) => ({
            key: grouping,
            display: projectDeliveryCycleFlowMetricsMeta[grouping].display,
          }))}
          initialValue={state.selectedMetric}
          onGroupingChanged={(newState) => dispatch({type: actionTypes.UPDATE_METRIC, payload: newState})}
        />
      </Flex>
      <FlowMetricsScatterPlotChart
        days={days}
        model={model}
        selectedMetric={state.selectedMetric}
        metricsMeta={projectDeliveryCycleFlowMetricsMeta}
        projectCycleMetrics={projectCycleMetrics}
        defectsOnly={defectsOnly}
        specsOnly={specsOnly}
        yAxisScale={"logarithmic"}
        onSelectionChange={(workItems) => {
          if (workItems.length === 1) {
            context.navigate(WorkItems, workItems[0].displayId, workItems[0].workItemKey);
          }
        }}
      />
    </React.Fragment>
  );
};
