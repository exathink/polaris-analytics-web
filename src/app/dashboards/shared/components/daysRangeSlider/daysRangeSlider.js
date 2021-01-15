import {Box, Flex} from "reflexbox";
import {Slider} from "antd";
import React from "react";

export const SIXTY_DAYS = [1, 3, 7, 14, 30, 45, 60];
export const SIX_MONTHS = [1, 7, 14, 30, 45, 60, 90, 180];

const getMarks = (marks) =>  marks.reduce(
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

export const DaysRangeSlider = ({title='Days', initialDays, setDaysRange, range}) => (
  <Flex align={'center'}>
    <Box pr={1} pt={"1px"}>
      {title}
    </Box>
    <Box pr={2} w={"100%"}>
      <Slider
        defaultValue={initialDays || 1}
        min={(range && range[0]) || 1}
        max={(range && range[range.length -1] )|| 60}
        marks={getMarks(range || SIXTY_DAYS)}
        included={true}
        onAfterChange={value => setDaysRange && setDaysRange(value)}/>
    </Box>
  </Flex>
)

export const TargetRangeSlider = ({title='Days', initialDays, setDaysRange, range, className}) => (
  <Flex align={'center'} className={className} data-testid="target-range-slider">
    <Box pr={1} pt={"1px"}>
      {title}
    </Box>
    <Box pr={2} w={"100%"}>
      <Slider
        defaultValue={initialDays || 1}
        min={(range && range[0]) || 1}
        max={(range && range[range.length -1] )|| 60}
        marks={getMarks(range || SIXTY_DAYS)}
        included={true}
        onChange={setDaysRange}
        value={initialDays}
      /> 
    </Box>
  </Flex>
)

export const ConfidenceRangeSlider = ({title = "Confidence", initialValue, setConfidenceRange, range, className}) => (
  <Flex align={"center"} className={className} data-testid="confidence-range-slider">
    <Box pr={1} pt={"1px"}>
      {title}
    </Box>
    <Box pr={2} w={"100%"}>
      <Slider
        defaultValue={initialValue || 0.9}
        value={initialValue}
        min={(range && range[0]) || 0}
        max={(range && range[range.length - 1]) || 100}
        marks={getMarks(range || [0, 50, 100])}
        included={true}
        step={1}
        onChange={setConfidenceRange}
      />
    </Box>
  </Flex>
);