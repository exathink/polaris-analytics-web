
import './dashboard.css';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import React from "react";
import Accounts from './accounts/context';
import {contextRouterFor} from "../navigation/contextRouter";
//types
import type {Context} from '../navigation/context';
import {withNavigation} from "../navigation/withNavigation";
import ContextManager from "../navigation/contextPath";


const context: Context = {
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


class DashboardControlBar extends React.Component<any> {

  constructor(props) {
    super(props);
  }


  drillBack() {
    const {navigation, navigate} = this.props;
    if (navigation.length > 1) {
      navigate.go(navigation[1].targetUrl())
    }
  };

  render() {
    const {navigate} = this.props;
    return (
      <div className="dashboard-controls">
        <nav className='menu' style={{width: '33%'}}>
          <i title="Back" className="menu-item ion ion-arrow-left-a" onClick={() => navigate.goBack()}/>
          <i title="Drill Back" className="menu-item ion ion-arrow-up-a" onClick={() => this.drillBack()}/>
          <i title="Forward" className="menu-item ion ion-arrow-right-a" onClick={() => navigate.goForward()}/>
        </nav>
        <nav className='menu menu-center' style={{width: '33%'}}>
        </nav>
        <nav className='menu menu-right' style={{width: '33%'}}>
          <FullscreenBtn componentId="dashboard"/>
        </nav>
      </div>
    )
  }
}

const DashboardControls = withNavigation(DashboardControlBar);

const DashboardContainer = (props:any) => (
  <LayoutWrapper id="dashboard" className="dashboard-wrapper">
    <ContextManager rootContext={context} {...props}/>
    <DashboardControls/>
    <div className="dashboard-vizzes">
      <DashboardRouter {...props} />
    </div>
  </LayoutWrapper>
);
export default DashboardContainer;