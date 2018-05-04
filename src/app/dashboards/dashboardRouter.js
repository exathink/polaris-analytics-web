// @flow
import './dashboard.css';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import React from "react";
import Accounts from './accounts/context';
import {contextRouterFor} from "../navigation/contextRouter";

//types
import type {Context} from '../navigation/context';

const context : Context = {
  name: 'dashboard',
  hidden: true,
  routes: [
    {
      match: 'account',
      context: Accounts,
    },
    {
      match: '',
      redirect: 'account'
    }
  ]
};

const DashboardRouter = contextRouterFor(context);


const DashboardMenu = () => (
  <nav className="dashboard-controls">
    <FullscreenBtn componentId="dashboard" />
  </nav>
);


export const DashboardWrapper = (props: any) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <DashboardMenu/>
    <div className="dashboard-vizzes">
      {props.children}
    </div>
  </LayoutWrapper>
);

export const DashboardContainer =  (props: any) => (
  <DashboardWrapper>
    <DashboardRouter {...props} />
  </DashboardWrapper>
);