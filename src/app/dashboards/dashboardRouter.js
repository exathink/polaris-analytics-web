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
  <div className="dashboard-controls">
    <nav className='menu' style={{width:'33%'}}>
      <i title="Back" className="menu-item ion ion-arrow-left-a"/>
      <i title="Drill Back" className="menu-item ion ion-arrow-up-a"/>
      <i title="Forward" className="menu-item ion ion-arrow-right-a"/>
    </nav>
    <nav className='menu menu-center' style={{width:'33%'}}>
    </nav>
    <nav className='menu menu-right' style={{width: '33%'}}>
      <FullscreenBtn componentId="dashboard"/>
    </nav>
  </div>
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