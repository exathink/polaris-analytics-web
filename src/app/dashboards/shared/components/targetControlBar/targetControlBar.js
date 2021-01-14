import {ConfidenceRangeSlider, TargetRangeSlider, SIX_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React from "react";
import {InputNumber} from "antd";

export function getTargetControlBar([
  [daysRange, setDaysRange, daysMarks],
  [confidence, setConfidence, confidenceMarks],
]) {
  // set defaults if none provided
  const targetMarks = daysMarks || SIX_MONTHS;
  const confMarks = confidenceMarks || [0, 0.5, 1]

  // get min and max from range
  const [targetMin, targetMax] = [Math.min(...targetMarks), Math.max(...targetMarks)];
  const [confMin, confMax] = [Math.min(...confMarks), Math.max(...confMarks)];

  return [
    () => (
      <>
        <TargetRangeSlider
          title="Target"
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
          title="Confidence"
          initialValue={confidence}
          setConfidenceRange={setConfidence}
          range={confMarks}
          className="confidenceRangeSlider"
        />
        <InputNumber
          min={confMin}
          max={confMax}
          step={0.01}
          style={{margin: "0 16px"}}
          value={confidence}
          onChange={setConfidence}
          data-testid="confidence-range-input"
        />
      </>
    ),
  ];
}
