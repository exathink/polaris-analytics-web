import {InputNumber, Slider} from "antd";
import React from "react";
import classNames from "classnames";
import {getMarks} from "./daysRangeSlider";
import styles from "./rangeSlider.module.css";

export const PercentageRangeSlider = ({title = "", value, setValue, range, className, testId}) => {
  const [minVal, maxVal] = [range[0], range[range.length - 1]];
  return (
    <div className={classNames(styles.percentageWrapper, className)} data-testid={testId}>
      {title && <div className={styles.percentageSliderTitle}>{title}</div>}
      <div className={styles.percentageSliderWrapper}>
        <div className={styles.percentageSlider}>
          <Slider
            value={+(value * 100).toFixed(2)}
            min={minVal}
            max={maxVal}
            marks={getMarks(range)}
            included={true}
            step={1}
            onChange={(value) => setValue(Math.floor(value) / 100.0)}
          />
        </div>
        <div className={styles.percentageSliderInputNumber}>
          <InputNumber
            min={minVal}
            max={maxVal}
            step={1}
            style={{margin: "0 16px"}}
            value={+(value * 100).toFixed(2)}
            onChange={(value) => setValue(Math.floor(value) / 100.0)}
            type="number"
          />
        </div>
      </div>
    </div>
  );
};
