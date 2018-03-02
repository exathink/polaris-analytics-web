import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import App from '../containers/App/App';
import Login from '../components/auth/Login'; 
import Logout from '../components/auth/Logout';

import RestrictedRoute from './RestrictedRoute';

export default ({ history }) => (
  <ConnectedRouter history={history}>
    <Switch>
      <Route
        path="/login"
        component={Login}
      />
      <Route
        path="/logout"
        component={Logout}
      />
      <RestrictedRoute
        path="/app"
        component={App}
      />
    </Switch>
  </ConnectedRouter>
);
