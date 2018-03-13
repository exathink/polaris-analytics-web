import './dashboard.css';
import React from 'react';
import { Flex, Box } from 'reflexbox';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';

const ItemMenu = props => (
  <nav className="dashboard-item-menu">
    <i className="ion ion-arrow-expand" title="Expand" onClick={props.onExpand || null}></i>
  </nav>
);

export const DashboardItem = ({ w=1, menuProps, children }) => (
  <Box w={w} m={1} className="dashboard-item">
    <ItemMenu {...menuProps} />
    { children }
  </Box>
);

export const DashboardRow = ({ h, children }) => (
  <Flex auto align='center' justify='space-between' className="dashboard-row" style={{
    height: h
  }}>
    { children }
  </Flex>
);

const DashboardMenu = () => (
  <nav className="dashboard-footer">
    <FullscreenBtn componentId="dashboard" />
  </nav>
);

export const Dashboard = ({ children }) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <div className="dashboard-vizzes">
      { children }
    </div>
    <DashboardMenu />
  </LayoutWrapper>
);
