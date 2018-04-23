import './dashboard.css';
import {ActivityDashboardsRouter} from './activity/activityDashboardsRouter';

import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import FourZeroFour from "../../containers/Page/404";
import React from "react";
import { Switch, Route, Redirect} from 'react-router-dom';


class DashboardsRouter extends React.Component {
  render() {
    const {match} = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}/activity`}
          component={ActivityDashboardsRouter}
        />
        <Route
          exact path={`${match.path}`}
          render={() => <Redirect to={`${match.path}/activity`} />}
        />
        <Route
          component={FourZeroFour}
        />
      </Switch>
    );
  }
}

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
    <DashboardsRouter {...props} />
  </DashboardWrapper>
);