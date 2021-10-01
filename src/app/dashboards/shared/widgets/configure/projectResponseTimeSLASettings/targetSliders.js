import React from "react";
import {getTargetControlBar} from "../../../components/targetControlBar/targetControlBar";
import {actionTypes, METRICS, mode} from "./constants";
import styles from "./projectResponseTimeSLASettings.module.css";

export function TargetSliders({leadTime, cycleTime, selectedMetric, mode: sliderMode, dispatch}) {
  // slider state
  const target = selectedMetric === METRICS.LEAD_TIME ? leadTime.target : cycleTime.target;
  const confidence = selectedMetric === METRICS.LEAD_TIME ? leadTime.confidence : cycleTime.confidence;

  return (
    <div className={styles["sliderWrapper"]}>
      {getTargetControlBar([
        [target, (newTarget) => dispatch({type: actionTypes.UPDATE_TARGET, payload: Math.floor(newTarget)})],
        [
          confidence,
          (newConfidence) => dispatch({type: actionTypes.UPDATE_CONFIDENCE, payload: newConfidence}),
          [0, 50, 100],
        ],
      ]).map((bar, index) => {
        let className = styles["slider-bar"];
        if (sliderMode === mode.EDITING) {
          if (selectedMetric === METRICS.LEAD_TIME) {
            if (leadTime.target !== leadTime.initialTarget && index === 0) {
              className += ` ${styles["slider-bar-edit"]}`;
            }
            if (leadTime.confidence !== leadTime.initialConfidence && index === 1) {
              className += ` ${styles["slider-bar-edit"]}`;
            }
          }
          if (selectedMetric === METRICS.CYCLE_TIME) {
            if (cycleTime.target !== cycleTime.initialTarget && index === 0) {
              className += ` ${styles["slider-bar-edit"]}`;
            }
            if (cycleTime.confidence !== cycleTime.initialConfidence && index === 1) {
              className += ` ${styles["slider-bar-edit"]}`;
            }
          }
        }
        return <div className={className} key={index}>{bar()}</div>;
      })}
    </div>
  );
}
