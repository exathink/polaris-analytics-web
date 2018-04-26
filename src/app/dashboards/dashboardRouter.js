import './dashboard.css';
import LayoutWrapper from '../../components/utility/layoutWrapper';
import FullscreenBtn from '../../components/buttons/FullscreenBtn';
import FourZeroFour from "../../containers/Page/404";
import React from "react";
import { Switch, Route, Redirect} from 'react-router-dom';
import asyncComponent from "../../helpers/AsyncFunc";


export class DashboardsRouter extends React.Component {
  render() {
    const {match} = this.props;
    return (
      <Switch>
        <Route
          path={`${match.path}/activity/projects/:organization/:project`}
          component={asyncComponent(() => import('./projects/project_activity_dashboard'))}
        />
        <Route
          path={`${match.path}/activity/organizations/:organization`}
          component={asyncComponent(() => import('./organizations/organization_activity_dashboard'))}
        />
        <Route
          path={`${match.path}/account`}
          component={asyncComponent(() => import('./accounts/account'))}
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
    <DashboardsRouter {...props} />
  </DashboardWrapper>
);