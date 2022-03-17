import {RadioButton, RadioGroup} from "../../../../../components/uielements/radio";
import React from "react";
import cn from "classnames";

export const GroupingSelector = ({
  label,
  groupings,
  initialValue,
  value,
  onGroupingChanged,
  className,
  layout = "row",
}) => {
  const valueObj = value != null ? {value: value} : {};
  return (
    groupings && (
      <div
        style={{zIndex: 2}}
        className={cn(
          "tw-flex",
          layout === "col" ? "tw-flex-col tw-justify-center" : "tw-flex-row tw-items-center",
          className
        )}
      >
        <div className="tw-pr-1">{label || "Group By"}</div>
        <div>
          <RadioGroup
            defaultValue={initialValue}
            onChange={(e) => onGroupingChanged && onGroupingChanged(e.target.value)}
            {...valueObj}
            size={"small"}
          >
            {groupings.map((grouping) => (
              <RadioButton key={grouping.key} value={grouping.key} style={grouping.style}>
                {grouping.display}
              </RadioButton>
            ))}
          </RadioGroup>
        </div>
      </div>
    )
  );
};