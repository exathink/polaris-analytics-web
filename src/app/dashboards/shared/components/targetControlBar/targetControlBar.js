import {ConfidenceRangeSlider, RangeSlider, SIX_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React from "react";
import {InputNumber} from "antd";

export function getTargetControlBar([
  [daysRange, setDaysRange, daysMarks],
  [confidence, setConfidence, confidenceMarks],
]) {
  // set defaults if none provided
  const targetMarks = daysMarks || SIX_MONTHS;
  const confMarks = confidenceMarks || [0, 50, 100];

  // get min and max from range
  const [targetMin, targetMax] = [Math.min(...targetMarks), Math.max(...targetMarks)];
  const [confMin, confMax] = [Math.min(...confMarks), Math.max(...confMarks)];

  return [
    () => (
      <>
        <RangeSlider
          title="Target in Days"
          initialDays={daysRange}
          setDaysRange={setDaysRange}
          range={targetMarks}
          className="targetRangeSlider"
        />
        <InputNumber
          min={targetMin}
          max={targetMax}
          style={{margin: "0 16px"}}
          value={daysRange}
          onChange={setDaysRange}
          data-testid="target-range-input"
        />
      </>
    ),
    () => (
      <>
        <ConfidenceRangeSlider
          title="% Confidence"
          initialValue={+(confidence * 100).toFixed(2)}
          setConfidenceRange={(value) => setConfidence(value / 100.0)}
          range={confMarks}
          className="confidenceRangeSlider"
        />
        <InputNumber
          min={confMin}
          max={confMax}
          step={1}
          style={{margin: "0 16px"}}
          value={+(confidence * 100).toFixed(2)}
          onChange={(value) => setConfidence(value / 100.0)}
          data-testid="confidence-range-input"
        />
      </>
    ),
  ];
}
