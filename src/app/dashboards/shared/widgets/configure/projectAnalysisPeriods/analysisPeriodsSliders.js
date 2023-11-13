import {InputNumber} from "antd";
import React from "react";
import {RangeSlider, TWO_MONTHS, THREE_MONTHS} from "../../../components/daysRangeSlider/daysRangeSlider";
import {actionTypes} from "./constants";
import styles from "./projectAnalysisPeriods.module.css";

export function AnalysisPeriodsSliders({wipPeriod, flowPeriod, trendsPeriod, initialAnalysisPeriods, showPanel, setShowPanel, dispatch}) {
  let [wipDaysMarks, flowDaysMarks, trendsDaysMarks] = [TWO_MONTHS, TWO_MONTHS, THREE_MONTHS];

  // get min and max from range
  const [wipMin, wipMax] = [wipDaysMarks[0], wipDaysMarks[wipDaysMarks.length - 1]];
  const [flowMin, flowMax] = [flowDaysMarks[0], flowDaysMarks[flowDaysMarks.length - 1]];
  const [trendsMin, trendsMax] = [trendsDaysMarks[0], trendsDaysMarks[trendsDaysMarks.length - 1]];
  
  const [setWipRange, setFlowRange, setTrendsRange] = [
    (newPeriod) => dispatch({type: actionTypes.UPDATE_WIP_PERIOD, payload: Math.floor(newPeriod)}),
    (newPeriod) => dispatch({type: actionTypes.UPDATE_FLOW_PERIOD, payload: Math.floor(newPeriod)}),
    (newPeriod) => dispatch({type: actionTypes.UPDATE_TRENDS_PERIOD, payload: Math.floor(newPeriod)}),
  ];

  const analysisPeriodItems = [
    {
      id: "wipAnalysisPeriod",
      title: "Branch Stability Window",
      period: wipPeriod,
      setPeriod: setWipRange,
      range: wipDaysMarks,
      min: wipMin,
      max: wipMax,
      className: wipPeriod !== initialAnalysisPeriods.wipAnalysisPeriod ? ` ${styles["analysis-slider-bar-edit"]}` : "",
      dataTestId: "wip-range-input",
    },
    {
      id: "flowAnalysisPeriod",
      title: "Work Item Stability Window",
      period: flowPeriod,
      setPeriod: setFlowRange,
      range: flowDaysMarks,
      min: flowMin,
      max: flowMax,
      className:
        flowPeriod !== initialAnalysisPeriods.flowAnalysisPeriod ? ` ${styles["analysis-slider-bar-edit"]}` : "",
      dataTestId: "flow-range-input",
    },
    {
      id: "trendsAnalysisPeriod",
      title: "Work Package Stability Window",
      period: trendsPeriod,
      setPeriod: setTrendsRange,
      range: trendsDaysMarks,
      min: trendsMin,
      max: trendsMax,
      className:
        trendsPeriod !== initialAnalysisPeriods.trendsAnalysisPeriod ? ` ${styles["analysis-slider-bar-edit"]}` : "",
      dataTestId: "trends-range-input",
    },
  ];

  return (
    <div className={styles["analysisItemsWrapper"]}>
      {analysisPeriodItems.map((item) => {
        return (
          <div key={item.id} className={styles["analysisItemWrapper"]}>
            <div className={`${styles["analysis-slider-bar"]} ${item.className}`}>
              <RangeSlider
                title={item.title}
                initialDays={item.period}
                setDaysRange={item.setPeriod}
                range={item.range}
                className={styles["analysisRangeSlider"]}
              />
              <InputNumber
                min={item.min}
                max={item.max}
                style={{margin: "0 16px"}}
                value={item.period}
                onChange={item.setPeriod}
                data-testid={item.dataTestId}
                type="number"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
