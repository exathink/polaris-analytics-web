import './dashboard.css';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import React from "react";
import Accounts from './accounts/accounts';
import {contextRouterFor} from "../navigation/contextRouter";

const routeTree = {
  name: 'dashboard',
  hidden: true,
  routes: [
    {
      match: 'account',
      component: Accounts,
    },
    {
      match: '',
      redirect: 'account'
    }
  ]
};

const DashboardRouter = contextRouterFor(routeTree);


const DashboardMenu = () => (
  <nav className="dashboard-footer">
    <FullscreenBtn componentId="dashboard" />
  </nav>
);


export const DashboardWrapper = (props) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <div className="dashboard-vizzes">
      {props.children}
    </div>
    <DashboardMenu/>
  </LayoutWrapper>
);

export const DashboardContainer =  (props) => (
  <DashboardWrapper>
    <DashboardRouter {...props} />
  </DashboardWrapper>
);