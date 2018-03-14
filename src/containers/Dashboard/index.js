import './dashboard.css';
import React from 'react';
import Menu from './menu';
import LayoutWrapper from '../../components/utility/layoutWrapper';

export default ({ children }) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <div className="dashboard-vizzes">
      { children }
    </div>
    <Menu />
  </LayoutWrapper>
);
