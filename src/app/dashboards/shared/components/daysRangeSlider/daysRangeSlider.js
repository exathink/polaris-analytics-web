import {Box, Flex} from "reflexbox";
import {Slider} from "antd";
import React from "react";

const marks = [1, 3, 7, 14, 30, 45, 60].reduce(
  (result, mark) => {
    result[mark] = {
      style: {
        fontSize: '10px',

      },
      label: `${mark}`
    };
    return result;
  },
  {}
);

export const DaysRangeSlider = ({initialDays, setDaysRange}) => (
  <Flex align={'center'}>
    <Box pr={1} pt={"1px"}>
      Days
    </Box>
    <Box pr={2} w={"100%"}>
      <Slider
        defaultValue={initialDays || 1}
        min={1}
        max={60}
        marks={marks}
        included={true}
        onAfterChange={value => setDaysRange && setDaysRange(value)}/>
    </Box>
  </Flex>
)