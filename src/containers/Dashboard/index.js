import React from 'react';
import { Flex, Box } from 'reflexbox';
import LayoutWrapper from '../../components/utility/layoutWrapper';

const wrapperStyle = {
  width: '100%',
  height: '100%'
};

const rowStyle = {
  width: '100%'
};

const itemStyle = {
  // for debugging-purposes
  // border: '5px dotted #666',
  height: '100%',
  background: 'skyblue'
};

export const DashboardItem = ({ w=1, children }) => (
  <Box w={w} m={2} style={itemStyle}>
    { children }
  </Box>
);

export const DashboardRow = ({ h, children }) => (
  <Flex auto align='center' justify='space-between' style={{
    ...rowStyle,
    height: h
  }}>
    { children }
  </Flex>
);

export const Dashboard = ({ children }) => (
  <LayoutWrapper style={wrapperStyle}>
    { children }
  </LayoutWrapper>
);
