import '../framework/viz/dashboard/dashboard.css';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import React from "react";
import Accounts from './accounts/context';
import Organizations from './organizations/context';
import Projects from './projects/context';

import {contextRouterFor} from "../framework/navigation/context/contextRouter";
//types
import type {Context} from '../framework/navigation/context/context';
import ContextManager from "../framework/navigation/components/contextManager";
import NavigationControls from "../framework/navigation/components/navigationControls";


const context: Context = {
  name: 'dashboard',
  hidden: true,
  routes: [
    {
      match: 'organizations',
      context: Organizations,
    },
    {
      match: 'projects',
      context: Projects,
    },
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


const DashboardControlBar = () => (
  <div className="dashboard-controls">
    <nav className='menu' style={{width: '33%'}}>
      <NavigationControls itemClass={"menu-item"}/>
    </nav>
    <nav className='menu menu-center' style={{width: '33%'}}>
    </nav>
    <nav className='menu menu-right' style={{width: '33%'}}>
      <FullscreenBtn componentId="dashboard"/>
    </nav>
  </div>
);

const DashboardContainer = (props: any) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <ContextManager rootContext={context} {...props}/>
    <DashboardControlBar/>
    <div className="dashboard-vizzes">
      <DashboardRouter {...props} />
    </div>
  </LayoutWrapper>
);
export default DashboardContainer;