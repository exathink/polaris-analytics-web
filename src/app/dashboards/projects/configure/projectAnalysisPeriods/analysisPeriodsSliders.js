import {InputNumber} from "antd";
import React from "react";
import {TargetRangeSlider, TWO_MONTHS} from "../../../shared/components/daysRangeSlider/daysRangeSlider";
import {actionTypes, mode} from "./constants";

const [wipInfo, flowInfo, trendsInfo] = ["Wip", "Flow", "Trends"];
export function AnalysisPeriodsSliders({
  wipPeriod,
  flowPeriod,
  trendsPeriod,
  initialAnalysisPeriods,
  mode: sliderMode,
  dispatch,
}) {
  let [wipDaysMarks, flowDaysMarks, trendsDaysMarks] = [TWO_MONTHS, TWO_MONTHS, TWO_MONTHS];
  if (wipPeriod >= 1) {
    flowDaysMarks = [wipPeriod, ...TWO_MONTHS.filter((x) => x > wipPeriod)];
  }
  if (flowPeriod >= 1) {
    trendsDaysMarks = [flowPeriod, ...TWO_MONTHS.filter((x) => x > flowPeriod)];
  }

  const [setWipRange, setFlowRange, setTrendsRange] = [
    (newPeriod) => dispatch({type: actionTypes.UPDATE_WIP_PERIOD, payload: newPeriod}),
    (newPeriod) => dispatch({type: actionTypes.UPDATE_FLOW_PERIOD, payload: newPeriod}),
    (newPeriod) => dispatch({type: actionTypes.UPDATE_TRENDS_PERIOD, payload: newPeriod}),
  ];

  // set defaults if none provided
  const [wipMarks, flowMarks, trendsMarks] = [
    wipDaysMarks || TWO_MONTHS,
    flowDaysMarks || TWO_MONTHS,
    trendsDaysMarks || TWO_MONTHS,
  ];

  // get min and max from range
  const [wipMin, wipMax] = [Math.min(...wipMarks), Math.max(...wipMarks)];
  const [flowMin, flowMax] = [Math.min(...flowMarks), Math.max(...flowMarks)];
  const [trendsMin, trendsMax] = [Math.min(...trendsMarks), Math.max(...trendsMarks)];

  const analysisPeriodItems = [
    {
      id: "wipAnalysisPeriod",
      title: "Wip Analysis Windo",
      period: wipPeriod,
      setPeriod: setWipRange,
      range: wipMarks,
      min: wipMin,
      max: wipMax,
      className: wipPeriod !== initialAnalysisPeriods.wipAnalysisPeriod ? " analysis-slider-bar-edit" : "",
      info: wipInfo,
      dataTestId: "wip-range-input",
    },
    {
      id: "flowAnalysisPeriod",
      title: "Flow Analysis Windo",
      period: flowPeriod,
      setPeriod: setFlowRange,
      range: flowMarks,
      min: flowMin,
      max: flowMax,
      className: flowPeriod !== initialAnalysisPeriods.flowAnalysisPeriod ? " analysis-slider-bar-edit" : "",
      info: flowInfo,
      dataTestId: "flow-range-input",
    },
    {
      id: "trendsAnalysisPeriod",
      title: "Trends Analysis Window",
      period: trendsPeriod,
      setPeriod: setTrendsRange,
      range: trendsMarks,
      min: trendsMin,
      max: trendsMax,
      className: trendsPeriod !== initialAnalysisPeriods.trendsAnalysisPeriod ? " analysis-slider-bar-edit" : "",
      info: trendsInfo,
      dataTestId: "trends-range-input",
    },
  ];

  return (
    <div className="analysisSliderWrapper">
      {analysisPeriodItems.map((item) => {
        return (
          <div key={item.id} className="analysisItemWrapper">
            <div className="analysis-info">{item.info}</div>
            <div className={`analysis-slider-bar ${item.className}`}>
              <TargetRangeSlider
                title={item.title}
                initialDays={item.period}
                setDaysRange={item.setPeriod}
                range={item.range}
                className="analysisRangeSlider"
              />
              <InputNumber
                min={item.min}
                max={item.max}
                style={{margin: "0 16px"}}
                value={item.period}
                onChange={item.setPeriod}
                data-testid={item.dataTestId}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
