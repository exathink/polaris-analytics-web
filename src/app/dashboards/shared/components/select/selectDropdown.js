import {Select} from "antd";
import React from "react";
import classNames from "classnames";

const {Option} = Select;

export function useSelect({uniqueItems, defaultVal}) {
  const [selectedVal, setSelectedVal] = React.useState(defaultVal);
  function handleChange(index) {
    setSelectedVal(uniqueItems[index]);
  }
  const valueIndex = uniqueItems.map((x) => x.key).indexOf(selectedVal.key);
  return {selectedVal, valueIndex, setSelectedVal, handleChange};
}
/**
 *
 * uniqueItems: array of {key, name} pair objects
 */
export function SelectDropdown({
  title,
  uniqueItems,
  testId,
  handleChange,
  wrapperClassName,
  className="tw-w-36",
  value,
  layout = "col",
}) {
  return (
    <div
      data-testid={testId}
      className={classNames(
        "tw-flex",
        layout === "col" ? "tw-flex-col" : "tw-flex-row tw-items-center tw-space-x-4",
        wrapperClassName
      )}
    >
      {title && <div>{title}</div>}
      <Select defaultValue={0} value={value} onChange={handleChange} className={className}>
        {uniqueItems.map((item, index) => (
          <Option key={item.key} value={index}>
            {item.icon} {item.name}
          </Option>
        ))}
      </Select>
    </div>
  );
}
