import {DaysRangeSlider, SIX_MONTHS} from "../daysRangeSlider/daysRangeSlider";
import React, {useState} from "react";
import {Radio} from "antd";
import styles from "./trendingControlBar.module.css";

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
  ]
) {
  return [
    () =>
      <div title="Days" style={{minWidth: "500px"}}>
        <DaysRangeSlider
          initialDays={daysRange}
          setDaysRange={setDaysRange}
          range={daysMarks || SIX_MONTHS}
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
        />
      </div>
    ,

  ]
}

function getMeasurementWindowMarks(freq) {
  if (freq === 1) {
    return [{key: 3, displayValue: 3}, {key: 5, displayValue: 5}, {key: 7, displayValue: 7}];
  } else if (freq === 7) {
    return [{key: 14, displayValue: 2}, {key: 28, displayValue: 4}, {key: 56, displayValue: 8}];
  } else {
    return null;
  }
}

export function NewTrendsControlBarControls({
  state: [
    [daysRange, setDaysRange, daysMarks],
    [measurementWindowRange, setMeasurementWindowRange, measurementWindowMarks],
    [frequencyRange, setFrequencyRange, frequencyRangeMarks],
    [rollingTrendsVisible, setRollingTrendsVisible],
  ],
}) {
  const [ONE, SEVEN, THIRTY] = [1, 7, 30];
  function getDays() {
    return (
      <div title="Days" className={styles.daysRange}>
        <DaysRangeSlider
          initialDays={daysRange}
          setDaysRange={setDaysRange}
          range={daysMarks || SIX_MONTHS}
          className={styles.daySlider}
        />
      </div>
    );
  }

  function getSamplingFrequency() {
    return (
      <div title="Sampling Frequency" className={styles.frequencyRange}>
        <label>Period</label>
        <Radio.Group
          buttonStyle="solid"
          size="small"
          onChange={(e) => {
            if (e.target.value === THIRTY) {
              setRollingTrendsVisible(false);
            }
            setFrequencyRange(e.target.value);
            setMeasurementWindowRange(e.target.value);
          }}
          value={frequencyRange}
          defaultValue={7}
          className={styles.frequencyRadioGroup}
        >
          <Radio.Button className={styles.commonRadioButton} value={ONE}>Daily</Radio.Button>
          <Radio.Button className={styles.commonRadioButton} value={SEVEN}>Weekly</Radio.Button>
          <Radio.Button className={styles.commonRadioButton} value={THIRTY}>Monthly</Radio.Button>
        </Radio.Group>
      </div>
    );
  }

  function getWindow() {
    return (
      <div title="Window" className={styles.windowRange}>
        <label className={styles.smoothing}>Smoothing</label>
        <Radio.Group
          size="small"
          disabled={frequencyRange === THIRTY}
          onChange={(e) => {
            if (e.target.value === false) {
              setMeasurementWindowRange(frequencyRange);
            }
            setRollingTrendsVisible(e.target.value);
          }}
          value={rollingTrendsVisible}
        >
          <Radio value={true}>On</Radio>
          <Radio value={false}>Off</Radio>
        </Radio.Group>
        {rollingTrendsVisible && frequencyRange !== THIRTY && (
          <div className={styles.measurementWindowWrapper}>
            <Radio.Group
              buttonStyle="solid"
              size="small"
              onChange={(e) => {
                setMeasurementWindowRange(e.target.value);
              }}
              value={measurementWindowRange}
              className={styles.windowRadioGroup}
            >
              {getMeasurementWindowMarks(frequencyRange).map((x) => {
                return (
                  <Radio.Button key={x} className={styles.commonRadioButton} value={x.key}>
                    {x.displayValue}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
            <div className={styles.unitText}>{frequencyRange === 1 ? "Days" : "Weeks"} </div>
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={styles.trendingControlBarWrapper}>
      {getDays()}
      {getSamplingFrequency()}
      {getWindow()}
    </div>
  );
}