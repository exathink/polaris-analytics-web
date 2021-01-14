import React from "react";
import {FlowMetricsScatterPlotChart} from "../../../shared/charts/flowMetricCharts/flowMetricsScatterPlotChart";
import {projectDeliveryCycleFlowMetricsMeta} from "../../../shared/helpers/metricsMeta";
import {METRICS, actionTypes, mode} from "./constants";
import {settingsReducer} from "./settingsReducer";
import {Alert, Button} from "antd";
import {useProjectUpdateSettings} from "../../shared/hooks/useQueryProjectUpdateSettings";
import {logGraphQlError} from "../../../../components/graphql/utils";
import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import {Flex} from "reflexbox";
import "./projectResponseTimeSLASettings.css";
import {TargetSliders} from "./targetSliders";

const groupings = [METRICS.LEAD_TIME, METRICS.CYCLE_TIME];

export const ProjectResponseTimeSLASettingsView = ({
  instanceKey,
  context,
  model,
  days,
  targetMetrics,
  defectsOnly,
  specsOnly,
}) => {
  // mutation to update project settings
  const [mutate, {loading, error, client}] = useProjectUpdateSettings({
    onCompleted: ({updateProjectSettings: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      }
    },
    onError: (error) => {
      logGraphQlError("TargetControlBarWidget.useProjectUpdateSettings", error);
    },
  });

  // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: actionTypes.UPDATE_DEFAULTS,
      payload: targetMetrics,
    });
  }, [...Object.values(targetMetrics)]);

  const initialState = {
    selectedMetric: METRICS.LEAD_TIME,
    leadTime: {
      target: targetMetrics.leadTimeTarget,
      confidence: targetMetrics.leadTimeConfidenceTarget,
      initialTarget: targetMetrics.leadTimeTarget,
      initialConfidence: targetMetrics.leadTimeConfidenceTarget,
    },
    cycleTime: {
      target: targetMetrics.cycleTimeTarget,
      confidence: targetMetrics.cycleTimeConfidenceTarget,
      initialTarget: targetMetrics.cycleTimeTarget,
      initialConfidence: targetMetrics.cycleTimeConfidenceTarget,
    },
    mode: mode.INIT,
  };

  const [state, dispatch] = React.useReducer(settingsReducer, initialState);
  const {leadTime, cycleTime, selectedMetric} = state;

  // as we want to show updated targets on the chart before saving.
  // sending this draft state to chart
  const draftTargetMetrics = {
    leadTimeTarget: leadTime.target,
    cycleTimeTarget: cycleTime.target,
    leadTimeConfidenceTarget: leadTime.confidence,
    cycleTimeConfidenceTarget: cycleTime.confidence,
  };

  const sliderProps = {...state, dispatch};

  function handleSaveClick() {
    const payload = {
      leadTimeTarget: leadTime.target,
      leadTimeConfidenceTarget: leadTime.confidence,
      cycleTimeTarget: cycleTime.target,
      cycleTimeConfidenceTarget: cycleTime.confidence,
    };

    // call mutation on save button click
    mutate({
      variables: {
        projectKey: instanceKey,
        flowMetricsSettings: payload,
      },
    });
  }

  function handleCancelClick() {
    dispatch({type: actionTypes.RESET_SLIDERS});
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className={"shiftRight"} type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button onClick={handleSaveClick} className={"targetSave"} type="primary" size="small" shape="round">
            Save
          </Button>
          <Button onClick={handleCancelClick} className={"targetCancel"} type="default" size="small" shape="round">
            Cancel
          </Button>
        </>
      );
    }

    if (state.mode === mode.SUCCESS) {
      return (
        <Alert
          message="Settings updated successfully."
          type="success"
          showIcon
          closable
          className="shiftRight"
          onClose={() => dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }
  }

  if (error) {
    logGraphQlError("TargetControlBarWidget.useProjectUpdateSettings", error);
    return null;
  }

  return (
    <React.Fragment>
      <div className="flowMetricControlsWrapper" data-testid="flowmetrics-setting-view">
        <Flex w={1} className="selectedMetricWrapper">
          <GroupingSelector
            label={" "}
            groupings={groupings.map((grouping) => ({
              key: grouping,
              display: projectDeliveryCycleFlowMetricsMeta[grouping].display,
            }))}
            initialValue={selectedMetric}
            onGroupingChanged={(newState) => dispatch({type: actionTypes.UPDATE_METRIC, payload: newState})}
          />
          <div className="targetControlButtons">{getButtonElements()}</div>
        </Flex>
        <TargetSliders {...sliderProps} />
      </div>
      <FlowMetricsScatterPlotChart
        days={days}
        model={model}
        selectedMetric={selectedMetric}
        metricsMeta={projectDeliveryCycleFlowMetricsMeta}
        targetMetrics={draftTargetMetrics}
        defectsOnly={defectsOnly}
        specsOnly={specsOnly}
        yAxisScale={"logarithmic"}
      />
    </React.Fragment>
  );
};
