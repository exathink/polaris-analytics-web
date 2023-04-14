import {Select, Tooltip, Tag} from "antd";
import classNames from "classnames";
import React from "react";
import {TOOLTIP_COLOR} from "../../../../helpers/utility";
import {CustomTag} from "../../../../helpers/components";
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
 */

/**
 *
 * @typedef {Object} Props
 * @property {DefaultOptionType[]} uniqueItems - The unique items.
 * @property {DefaultOptionType} selectedValue - control value prop
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
        value={selectedValue}
        className={className}
        onChange={(_value, option) => {
          handleChange(option);
        }}
        title={selectedValue?.label}
        getPopupContainer={(node) => node.parentNode}
      >
        {uniqueItems.map((item) => (
          <Option key={item.value} {...item} title={item.label}>
            {item.icon} {item.label}
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

  const tagRender = ({label, value, closable, onClose}) => {
    const index = selectedValues.findIndex((item) => item.value === value);
    if (index < 1) {
      return (
        <Tag closable={closable} onClose={onClose} key={value}>
          {label}
        </Tag>
      );
    }
    if (index === 1) {
      const remainingCount = selectedValues.length - 1;
      const remainingLabels = selectedValues.slice(1).map((item) => item.label);

      const remainingElements = (
        <div className="tw-p-1">
          {remainingLabels.map((x) => (
            <CustomTag key={x}>{x}</CustomTag>
          ))}
        </div>
      );

      return (
        <Tooltip title={remainingElements} key="remaining-tooltip" color={TOOLTIP_COLOR}>
          <span className="tw-ml-2 tw-cursor-pointer">+{remainingCount} more</span>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <div data-testid={testId} className={selectClassName}>
      {title && <div>{title}</div>}
      <Select
        defaultValue={selectedValues}
        value={selectedValues}
        placeholder={defaultOptionType.label}
        style={{minWidth: 144}}
        className={className}
        onChange={(_values, options) => {
          handleChange(options);
        }}
        mode="multiple"
        getPopupContainer={(node) => node.parentNode}
        showArrow
        tagRender={tagRender}
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

/**
 * @typedef {Object} DefaultOption
 * @property {'All'} label - The label of the object.
 * @property {'all'} value - The value of the object.
 */

/**
 * @type {DefaultOption}
 * @constant
 * @default
 */
export const defaultOptionType = {label: "All", value: "all"};
