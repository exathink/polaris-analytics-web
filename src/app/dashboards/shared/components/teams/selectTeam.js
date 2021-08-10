import {Select} from "antd";
import React from "react";
import styles from "./selectDropdown.module.css";
import classNames from "classnames";

const DEFAULT_WIDTH = 150;

const {Option} = Select;

export function useSelect({uniqueItems, defaultVal}) {
  const [selectedVal, setSelectedVal] = React.useState(defaultVal);
  function handleChange(index) {
    setSelectedVal(uniqueItems[index]);
  }

  return {selectedVal, setSelectedVal, handleChange};
}
/**
 *
 * uniqueItems: array of {key, name} pair objects
 */
export function SelectDropdown({title, uniqueItems, testId, handleChange, width = DEFAULT_WIDTH, className}) {
  return (
    <div data-testid={testId} className={classNames(styles.selectWrapper, className)}>
      {title && <div className={styles.title}>{title}</div>}
      <Select defaultValue={0} onChange={handleChange} className={styles.selectControl} style={{width: width}}>
        {uniqueItems.map((item, index) => (
          <Option key={item.key} value={index}>
            {item.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
