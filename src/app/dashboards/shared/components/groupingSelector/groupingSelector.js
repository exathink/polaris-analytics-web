import {Box, Flex} from "reflexbox";
import {RadioButton, RadioGroup} from "../../../../../components/uielements/radio";
import React from "react";

export const GroupingSelector = ({label, groupings, initialValue, value, onGroupingChanged, className}) => {
  const valueObj = value != null ? {value: value} : {};
  return (
  groupings &&
  <Flex align={'center'} style={{zIndex: 2}} className={className}>
    <Box pr={1} pt={"1px"}>
      {label || "Group By"}
    </Box>
    <Box>
      <RadioGroup
        defaultValue={initialValue}
        onChange={
          e => onGroupingChanged && onGroupingChanged(e.target.value)
        }
        {...valueObj}
        size={"small"}>
        {
          groupings.map(
            grouping =>
              <RadioButton
                key={grouping.key}
                value={grouping.key}
                style={grouping.style}
              >
                {grouping.display}
              </RadioButton>
          )
        }
      </RadioGroup>
    </Box>
  </Flex>
)}