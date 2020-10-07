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
    [daysRange, setDaysRange],
    [measurementWindowRange, setMeasurementWindowRange],
    [frequencyRange, setFrequencyRange]
  ]
) {
  return [
    () =>
      <div title="Days" style={{minWidth: "500px"}}>
        <DaysRangeSlider
          initialDays={daysRange}
          setDaysRange={setDaysRange}
          range={SIX_MONTHS}
        />
      </div>
    ,
    () =>
      <div title="Sampling Frequency" style={{minWidth: "200px"}}>
        <DaysRangeSlider
          title={'Frequency'}
          initialDays={frequencyRange}
          setDaysRange={setFrequencyRange}
          range={[1, 7, 14, 30]}
        />
      </div>
    ,
    () =>
      <div title="Window" style={{minWidth: "200px"}}>
        <DaysRangeSlider
          title={'Window'}
          initialDays={measurementWindowRange}
          setDaysRange={setMeasurementWindowRange}
          range={[1, 7, 14, 30]}
        />
      </div>
    ,

  ]
}