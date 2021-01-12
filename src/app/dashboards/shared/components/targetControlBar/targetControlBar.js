import {ConfidenceRangeSlider, TargetRangeSlider, SIX_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React from "react";
import {InputNumber} from "antd";

export function getTargetControlBar([
  [daysRange, setDaysRange, daysMarks],
  [confidence, setConfidence, confidenceMarks],
]) {
  return [
    () => (
      <>
        <TargetRangeSlider
          title="Target"
          initialDays={daysRange}
          setDaysRange={setDaysRange}
          range={daysMarks || SIX_MONTHS}
          className="targetRangeSlider"
        />
        <InputNumber min={1} max={180} style={{margin: "0 16px"}} value={daysRange} onChange={setDaysRange} />
      </>
    ),
    () => (
      <>
        <ConfidenceRangeSlider
          title="Confidence"
          initialValue={confidence}
          setConfidenceRange={setConfidence}
          range={confidenceMarks}
          className="confidenceRangeSlider"
        />
        <InputNumber min={0} max={1.0} step={0.01} style={{margin: "0 16px"}} value={confidence} onChange={setConfidence} />
      </>
    ),
  ];
}
