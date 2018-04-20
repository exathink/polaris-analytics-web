import React from 'react';
import { Switch, Route, Redirect} from 'react-router-dom';
import asyncComponent from '../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    const { match } = this.props;
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
        <Redirect
          to={`${match.path}/account`}
        />
      </Switch>
    );
  }
}

export default AppRouter;
