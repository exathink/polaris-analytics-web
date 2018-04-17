import React from 'react';
import { Switch, Route } from 'react-router-dom';
import asyncComponent from '../helpers/AsyncFunc';

class AppRouter extends React.Component {
  render() {
    const { url } = this.props;
    return (
      <Switch>
        <Route
          path={`${url}/organizations/:organization`}
          component={asyncComponent(() => import('./organizations/organizations_dashboard'))}
        />
        <Route
          path={`${url}`}
          component={asyncComponent(() => import('./accounts/account_dashboard'))}
        />
      </Switch>
    );
  }
}

export default AppRouter;
