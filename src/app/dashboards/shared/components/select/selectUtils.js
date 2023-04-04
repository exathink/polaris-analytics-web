import {Select} from "antd";
import classNames from "classnames";
import React from "react";
const {Option} = Select;

export function useSelect(defaultValue) {
  const [selectedValue, setSelectedValue] = React.useState(defaultValue);
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
 * @property {DefaultOptionType} [selectedValue] - control value prop
 * @property {(value?: DefaultOptionType) => void} handleChange - The change handler.
 * @property {'row' | 'col'} [layout] - row or column layout
 * @property {string} [wrapperClassName] - class for parent wrapper div
 * @property {string} [className] - class for select
 * @property {string} [title] - tooltip for select
 * @property {string} [testId] - testId for select dropdown
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
  selectedValue,
  handleChange,
  layout = "col",
  wrapperClassName,
  className,
  testId,
  title,
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
        defaultValue={selectedValue}
        style={{width: 200}}
        className={className}
        onChange={(_value, option) => {
          handleChange(option);
        }}
        title={selectedValue?.label}
      >
        {uniqueItems.map((item) => (
          <Option key={item.value} {...item} title={item.label}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}

export function useSelectMultiple(defaultValues = []) {
  const [selectedValues, setSelectedValues] = React.useState(defaultValues);
  function handleChange(values) {
    setSelectedValues(values);
  }
  return {selectedValues, handleChange};
}

/**
 * @typedef {import("antd/lib/select").DefaultOptionType} DefaultOptionType
 *
 * @typedef {Object} PropsMultiple
 * @property {DefaultOptionType[]} uniqueItems - The unique items.
 * @property {DefaultOptionType[]} selectedValues - control value prop
 * @property {(values?: [DefaultOptionType]) => void} handleChange - The change handler.
 * @property {'row' | 'col'} [layout] - row or column layout
 * @property {string} [wrapperClassName] - class for parent wrapper div
 * @property {string} [className] - class for select
 * @property {string} [title] - tooltip for select
 * @property {string} testId - testId for select dropdown
 */

/**
 * A Custom Select component
 * @param {PropsMultiple} {
 *   uniqueItems,
 *   selectedValues,
 *   handleChange,
 *   layout="col",
 *   wrapperClassName,
 *   className,
 *   title,
 *   testId,
 * }
 */
export function SelectDropdownMultiple({
  uniqueItems,
  selectedValues,
  handleChange,
  layout = "col",
  wrapperClassName,
  className,
  title,
  testId,
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
        defaultValue={selectedValues}
        style={{width: 200}}
        className={className}
        onChange={(_values, options) => {
          handleChange(options);
        }}
        mode="multiple"
      >
        {uniqueItems.map((item) => (
          <Option key={item.value} {...item}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
