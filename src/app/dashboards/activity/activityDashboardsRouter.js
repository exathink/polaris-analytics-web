import '../dashboard.css';
import React from "react";
import asyncComponent from "../../../helpers/AsyncFunc";
import { Switch, Route, Redirect} from 'react-router-dom';
import FourZeroFour from "../../../containers/Page/404";

export class ActivityDashboardsRouter extends React.Component {
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





