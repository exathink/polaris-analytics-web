import React from 'react';
import { Flex, Box } from 'reflexbox';
import LayoutWrapper from '../../components/utility/layoutWrapper';

const wrapperStyle =  { width: '100%', height: '100%', padding: 0 };

const rowStyle = { width: '100%' };

const itemStyle = {
  height: '100%',
  padding: '10%',
  border: '2px solid slategrey',
  background: 'ghostwhite'
};

export const DashboardItem = ({ w=1, children }) => (
  <Box w={w} style={itemStyle}>
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
