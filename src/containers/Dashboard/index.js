import React from 'react';
import { Flex, Box } from 'reflexbox';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import './dashboard.css';

const ItemMenu = props => (
  <nav className="dashboard-item-menu">
    <i className="ion ion-arrow-expand" title="Expand" onClick={props.onExpand || null}></i>
  </nav>
);

export const DashboardItem = ({ w=1, menuProps, children }) => (
  <Box w={w} className="dashboard-item">
    <ItemMenu {...menuProps} />
    { children }
  </Box>
);

export const DashboardRow = ({ h, children }) => (
  <Flex auto align='center' justify='space-between' style={{
    width: '100%',
    height: h
  }}>
    { children }
  </Flex>
);

export const Dashboard = ({ children }) => (
  <LayoutWrapper className="dashboard-wrapper">
    { children }
  </LayoutWrapper>
);
