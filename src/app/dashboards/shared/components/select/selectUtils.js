import {Select} from "antd";
import classNames from "classnames";
import React from "react";
const {Option} = Select;

export function useSelect() {
  const [selectedValue, setSelectedValue] = React.useState();
  function handleChange(item) {
    setSelectedValue(item);
  }
  return {selectedValue, handleChange};
}

/**
 * @typedef {import("antd/lib/select").DefaultOptionType} DefaultOptionType
 *
 * @typedef {Object} Props
 * @property {DefaultOptionType[]} uniqueItems - The unique items.
 * @property {(value?: DefaultOptionType) => void} handleChange - The change handler.
 * @property {number} [defaultValueIndex] - The default value index.
 * @property {DefaultOptionType} [selectedValue] - control value prop
 * @property {string} testId - testId for select dropdown
 * @property {'row' | 'col'} [layout] - row or column layout
 * @property {string} [wrapperClassName] - class for parent wrapper div
 * @property {string} [title] - tooltip for select
 * @property {string} [className] - class for select
 */

/**
 * A Custom Select component
 * @param {Props} {
 *   uniqueItems,
 *   handleChange,
 *   defaultValueIndex = 0,
 *   selectedValue,
 *   testId,
 *   layout="col",
 *   wrapperClassName,
 *   title,
 *   className,
 * }
 */
export function SelectDropdown({
  uniqueItems,
  handleChange,
  defaultValueIndex = 0,
  selectedValue,
  testId,
  layout = "col",
  wrapperClassName,
  title,
  className,
}) {
  const selectClassName = classNames(
    "tw-flex",
    layout === "col" ? "tw-flex-col" : "tw-flex-row tw-items-center tw-space-x-4",
    wrapperClassName
  );

  return (
    <div data-testid={testId} className={selectClassName}>
      {title && <div>{title}</div>}
      <Select
        defaultValue={uniqueItems[defaultValueIndex].value}
        style={{width: 200}}
        className={className}
        onChange={(value, option) => {
          handleChange(option);
        }}
        title={selectedValue?.label ?? uniqueItems[defaultValueIndex].label}
      >
        {uniqueItems.map((item) => (
          <Option key={item.value} value={item.value} title={item.label}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
