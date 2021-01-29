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
  const [targetMin, targetMax] = [targetMarks[0], targetMarks[targetMarks.length - 1]];
  const [confMin, confMax] = [confMarks[0], confMarks[confMarks.length - 1]];

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
          type="number"
          data-testid="target-range-input"
        />
      </>
    ),
    () => (
      <>
        <ConfidenceRangeSlider
          title="% Confidence"
          initialValue={+(confidence * 100).toFixed(2)}
          setConfidenceRange={(value) => setConfidence(Math.floor(value) / 100.0)}
          range={confMarks}
          className="confidenceRangeSlider"
        />
        <InputNumber
          min={confMin}
          max={confMax}
          step={1}
          style={{margin: "0 16px"}}
          value={+(confidence * 100).toFixed(2)}
          onChange={(value) => setConfidence(Math.floor(value) / 100.0)}
          type="number"
          data-testid="confidence-range-input"
        />
      </>
    ),
  ];
}
