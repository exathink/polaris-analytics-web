// @flow
import './dashboard.css';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import React from "react";
import Accounts from './accounts/context';
import {contextRouterFor} from "../navigation/contextRouter";

//types
import type {Context} from '../navigation/context';
import {connect} from 'react-redux';
import {withNavigation} from "../navigation/withNavigation";
import {withRouter} from 'react-router';


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


const DashboardControlBar = (props) => {
  const {navigation, navigate} = props;

  const drillBack = () => {
    if (navigation.length > 1) {
      navigate.go(navigation[1].targetUrl())
    }
  };
  return (
    <div className="dashboard-controls">
      <nav className='menu' style={{width: '33%'}}>
        <i title="Back" className="menu-item ion ion-arrow-left-a" onClick={() => navigate.goBack()}/>
        <i title="Drill Back" className="menu-item ion ion-arrow-up-a" onClick={() => drillBack()}/>
        <i title="Forward" className="menu-item ion ion-arrow-right-a" onClick={() => navigate.goForward()}/>
      </nav>
      <nav className='menu menu-center' style={{width: '33%'}}>
      </nav>
      <nav className='menu menu-right' style={{width: '33%'}}>
        <FullscreenBtn componentId="dashboard"/>
      </nav>
    </div>
  )
};

const DashboardMenu = withNavigation(DashboardControlBar);

class DashboardContainer extends React.Component<any> {

  shouldComponentUpdate(nextProps, nextState) {
    // suppress a full tree re-render unless the nav location has changed.
    return this.props.location !== nextProps.location;
  }

  render() {
    return (
      <LayoutWrapper id="dashboard" className="dashboard-wrapper">
        <DashboardMenu/>
        <div className="dashboard-vizzes">
          <DashboardRouter {...this.props} />
        </div>
      </LayoutWrapper>
    );
  };
}

export default withRouter(DashboardContainer);