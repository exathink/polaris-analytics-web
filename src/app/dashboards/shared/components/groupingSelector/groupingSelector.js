import {Box, Flex} from "reflexbox";
import {RadioButton, RadioGroup} from "../../../../../components/uielements/radio";
import React from "react";

export const GroupingSelector = ({groupings, initialValue, onGroupingChanged}) => (
  groupings &&
  <Flex align={'center'}>
    <Box pr={1} pt={"1px"}>
      Group By
    </Box>
    <Box>
      <RadioGroup
        defaultValue={initialValue}
        onChange={
          e => onGroupingChanged && onGroupingChanged(e.target.value)
        }
        size={"small"}>
        {
          groupings.map(
            grouping =>
              <RadioButton
                key={grouping.key}
                value={grouping.key}
              >
                {grouping.display}
              </RadioButton>
          )
        }
      </RadioGroup>
    </Box>
  </Flex>
)