import React from "react";
import {Alert, Button} from "antd";
import {getTargetControlBar} from "../../../../shared/components/targetControlBar/targetControlBar";
import {useProjectUpdateSettings} from "../../hooks/useQueryProjectUpdateSettings";
import "./TargetControlBarSliders.css";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {actionTypes, METRICS, mode} from "./constants";

export function TargetControlBarSliders({targetControlBarState, projectKey}) {
  const {leadTime, cycleTime, selectedMetric, dispatch} = targetControlBarState;

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

  const target = selectedMetric === METRICS.LEAD_TIME ? leadTime.target : cycleTime.target;
  const confidence = selectedMetric === METRICS.LEAD_TIME ? leadTime.confidence : cycleTime.confidence;

  function handleSaveClick() {
    let payload;
    if (selectedMetric === METRICS.LEAD_TIME) {
      payload = {
        leadTimeTarget: leadTime.target,
        leadTimeConfidenceTarget: leadTime.confidence,
      };
    } else {
      payload = {
        cycleTimeTarget: cycleTime.target,
        cycleTimeConfidenceTarget: cycleTime.confidence,
      };
    }

    // call mutation on save button click
    mutate({
      variables: {
        projectKey,
        flowMetricsSettings: payload,
      },
    });
  }

  function handleCancelClick() {
    // only resets for currently selected metric
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

    if (
      (selectedMetric === METRICS.LEAD_TIME && leadTime.mode === mode.EDITING) ||
      (selectedMetric === METRICS.CYCLE_TIME && cycleTime.mode === mode.EDITING)
    ) {
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

    if (selectedMetric === METRICS.LEAD_TIME && leadTime.mode === mode.SUCCESS) {
      return (
        <Alert
          message="Settings updated successfully for leadTime."
          type="success"
          showIcon
          closable
          className="shiftRight"
          onClose={() => {
            debugger;
            dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL});
          }}
        />
      );
    }

    if (selectedMetric === METRICS.CYCLE_TIME && cycleTime.mode === mode.SUCCESS) {
      return (
        <Alert
          message="Settings updated successfully for cycleTime."
          type="success"
          showIcon
          closable
          className="shiftRight"
          onClose={() => {
            debugger;
            dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL});
          }}
        />
      );
    }
  }

  if (error) {
    logGraphQlError("TargetControlBarWidget.useProjectUpdateSettings", error);
    return null;
  }

  return (
    <div className="targetControlBarWrapper">
      <div className="sliderWrapper">
        {getTargetControlBar([
          [target, (newTarget) => dispatch({type: actionTypes.UPDATE_TARGET, payload: newTarget})],
          [
            confidence,
            (newConfidence) => dispatch({type: actionTypes.UPDATE_CONFIDENCE, payload: newConfidence}),
            [0, 0.5, 1.0],
          ],
        ]).map((bar) => bar())}
      </div>
      {getButtonElements()}
    </div>
  );
}
