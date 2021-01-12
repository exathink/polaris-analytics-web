import {ConfidenceRangeSlider, TargetRangeSlider, SIX_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React from "react";

export function getTargetControlBar([
  [daysRange, setDaysRange, daysMarks],
  [confidence, setConfidence, confidenceMarks],
]) {
  return [
    () => (
      <TargetRangeSlider
        title="Target"
        initialDays={daysRange}
        setDaysRange={setDaysRange}
        range={daysMarks || SIX_MONTHS}
        className="targetRangeSlider"
      />
    ),
    () => (
      <ConfidenceRangeSlider
        title="Confidence"
        initialValue={confidence}
        setConfidenceRange={setConfidence}
        range={confidenceMarks}
        className="confidenceRangeSlider"
      />
    ),
  ];
}
