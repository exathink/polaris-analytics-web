import './dashboard.css';
import React from "react";
import asyncComponent from "../../helpers/AsyncFunc";
import { Switch, Route, Redirect} from 'react-router-dom';

import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import FourZeroFour from "../../containers/Page/404";
class DashboardRouter extends React.Component {
  render() {
    const {match} = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}/projects/:organization/:project`}
          component={asyncComponent(() => import('./projects/projects_dashboard'))}
        />
        <Route
          path={`${match.path}/organizations/:organization`}
          component={asyncComponent(() => import('./organizations/organizations_dashboard'))}
        />
        <Route
          path={`${match.path}/account`}
          component={asyncComponent(() => import('./accounts/account_dashboard'))}
        />
        <Route
          exact path={`${match.path}`}
          render={() => <Redirect to={`${match.path}/account`} />}
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
    <DashboardRouter {...props} />
  </DashboardWrapper>
);


