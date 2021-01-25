import React from "react";
import {getAnalysisControlBar} from "../../../shared/components/analysisControlBar/analysisControlBar";
import {TWO_MONTHS} from "../../../shared/components/daysRangeSlider/daysRangeSlider";
import {actionTypes, mode} from "./constants";

export function AnalysisPeriodsSliders({
  wipPeriod,
  flowPeriod,
  trendsPeriod,
  initialAnalysisPeriods,
  mode: sliderMode,
  dispatch,
}) {
  // [1, 7, 14, 30, 45, 60];
  let flowDaysMarks = TWO_MONTHS;
  let trendsDaysMarks = TWO_MONTHS;
  if (wipPeriod >= 1) {
    flowDaysMarks = [wipPeriod, ...TWO_MONTHS.filter((x) => x > wipPeriod)];
  }
  if (flowPeriod >= 1) {
    trendsDaysMarks = [flowPeriod, ...TWO_MONTHS.filter((x) => x > flowPeriod)];
  }

  return (
    <div className="analysisSliderWrapper">
      {getAnalysisControlBar([
        [wipPeriod, (newPeriod) => dispatch({type: actionTypes.UPDATE_WIP_PERIOD, payload: newPeriod})],
        [
          flowPeriod,
          (newPeriod) => dispatch({type: actionTypes.UPDATE_FLOW_PERIOD, payload: newPeriod}),
          flowDaysMarks,
        ],
        [
          trendsPeriod,
          (newPeriod) => dispatch({type: actionTypes.UPDATE_TRENDS_PERIOD, payload: newPeriod}),
          trendsDaysMarks,
        ],
      ]).map((bar, index) => {
        let className = "analysis-slider-bar";
        if (sliderMode === mode.EDITING) {
          if (wipPeriod !== initialAnalysisPeriods.wipAnalysisPeriod && index === 0) {
            className += " analysis-slider-bar-edit";
          }

          if (flowPeriod !== initialAnalysisPeriods.flowAnalysisPeriod && index === 1) {
            className += " analysis-slider-bar-edit";
          }

          if (trendsPeriod !== initialAnalysisPeriods.trendsAnalysisPeriod && index === 2) {
            className += " analysis-slider-bar-edit";
          }
        }
        return (
          <div className={className} key={index}>
            {bar()}
          </div>
        );
      })}
    </div>
  );
}
