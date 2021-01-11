import {ConfidenceRangeSlider, TargetRangeSlider, SIX_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React from "react";

export function getTargetControlBar([
  [daysRange, setDaysRange, daysMarks],
  [confidence, setConfidence, confidenceMarks],
]) {
  return [
    () => (
      <div title="Target" style={{minWidth: "500px"}}>
        <TargetRangeSlider
          title="Target"
          initialDays={daysRange}
          setDaysRange={setDaysRange}
          range={daysMarks || SIX_MONTHS}
        />
      </div>
    ),
    () => (
      <div title="Confidence" style={{minWidth: "200px"}}>
        <ConfidenceRangeSlider
          title="Confidence"
          initialValue={confidence}
          setConfidenceRange={setConfidence}
          range={confidenceMarks}
        />
      </div>
    ),
  ];
}
