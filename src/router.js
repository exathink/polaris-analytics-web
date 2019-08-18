import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';


import App from './app/app';
import Login from './app/components/auth/Login';
import Logout from './app/components/auth/Logout';

import RestrictedRoute from './app/components/auth/restrictedRoute';
import FourZeroFour from "./containers/Page/404";

export default () => (
  <BrowserRouter>
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
      <RestrictedRoute
        exact path="/" component={() => <Redirect to='/app'/>}
      />
      <RestrictedRoute
        component={FourZeroFour}
      />
    </Switch>
  </BrowserRouter>
);
