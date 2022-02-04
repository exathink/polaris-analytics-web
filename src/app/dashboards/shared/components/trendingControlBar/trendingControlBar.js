import {DaysRangeSlider, SIX_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React, {useState} from "react";

export function useTrendsControlBarState(days, measurementWindow, samplingFrequency) {
  const [daysRange, setDaysRange] = useState(days);
  const [measurementWindowRange, setMeasurementWindowRange] = useState(measurementWindow);
  const [frequencyRange, setFrequencyRange] = useState(samplingFrequency);


  return [
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ]


}

export function getTrendsControlBarControls(
  [
    [daysRange, setDaysRange, daysMarks],
    [measurementWindowRange, setMeasurementWindowRange, measurementWindowMarks],
    [frequencyRange, setFrequencyRange, frequencyRangeMarks]
  ],
  titleLayout="row"
) {
  return [
    () =>
      <div title="Days" style={{minWidth: "500px"}}>
        <DaysRangeSlider
          initialDays={daysRange}
          setDaysRange={setDaysRange}
          range={daysMarks || SIX_MONTHS}
          layout={titleLayout}
        />
      </div>
    ,
    () =>
      <div title="Sampling Frequency" style={{minWidth: "200px"}}>
        <DaysRangeSlider
          title={'Frequency'}
          initialDays={frequencyRange}
          setDaysRange={setFrequencyRange}
          range={frequencyRangeMarks || [1, 7, 14, 30]}
          layout={titleLayout}
        />
      </div>
    ,
    () =>
      <div title="Window" style={{minWidth: "200px"}}>
        <DaysRangeSlider
          title={'Window'}
          initialDays={measurementWindowRange}
          setDaysRange={setMeasurementWindowRange}
          range={measurementWindowMarks || [1, 7, 14, 30]}
          layout={titleLayout}
        />
      </div>
    ,

  ]
}