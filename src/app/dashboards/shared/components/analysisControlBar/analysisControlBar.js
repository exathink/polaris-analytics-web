import {TargetRangeSlider, TWO_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React from "react";
import {InputNumber} from "antd";

export function getAnalysisControlBar([
  [wipRange, setWipRange, wipDaysMarks],
  [flowRange, setFlowRange, flowDaysMarks],
  [trendsRange, setTrendsRange, trendsDaysMarks],
]) {
  // set defaults if none provided
  const wipMarks = wipDaysMarks || TWO_MONTHS;
  const flowMarks = flowDaysMarks || TWO_MONTHS;
  const trendsMarks = trendsDaysMarks || TWO_MONTHS;

  // get min and max from range
  const [wipMin, wipMax] = [Math.min(...wipMarks), Math.max(...wipMarks)];
  const [flowMin, flowMax] = [Math.min(...flowMarks), Math.max(...flowMarks)];
  const [trendsMin, trendsMax] = [Math.min(...trendsMarks), Math.max(...trendsMarks)];

  return [
    () => (
      <>
        <TargetRangeSlider
          title="Wip Analysis Window"
          initialDays={wipRange}
          setDaysRange={setWipRange}
          range={wipMarks}
          className="targetRangeSlider"
        />
        <InputNumber
          min={wipMin}
          max={wipMax}
          style={{margin: "0 16px"}}
          value={wipRange}
          onChange={setWipRange}
          data-testid="wip-range-input"
        />
      </>
    ),
    () => (
      <>
        <TargetRangeSlider
          title="Flow Analysis Window"
          initialDays={flowRange}
          setDaysRange={setFlowRange}
          range={flowMarks}
          className="targetRangeSlider"
        />
        <InputNumber
          min={flowMin}
          max={flowMax}
          style={{margin: "0 16px"}}
          value={flowRange}
          onChange={setFlowRange}
          data-testid="flow-range-input"
        />
      </>
    ),
    () => (
      <>
        <TargetRangeSlider
          title="Trends Analysis Window"
          initialDays={trendsRange}
          setDaysRange={setTrendsRange}
          range={trendsMarks}
          className="targetRangeSlider"
        />
        <InputNumber
          min={trendsMin}
          max={trendsMax}
          style={{margin: "0 16px"}}
          value={trendsRange}
          onChange={setTrendsRange}
          data-testid="trends-range-input"
        />
      </>
    )
  ];
}
