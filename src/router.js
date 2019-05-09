import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';


import App from './app/app';
import Login from './app/components/auth/Login';
import Logout from './app/components/auth/Logout';

import RestrictedRoute from './app/components/auth/restrictedRoute';
import FourZeroFour from "./containers/Page/404";
import {connect} from "react-redux";
import {withViewerContext} from "./app/framework/viewer/viewerContext";

export default ({history}) => (
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
      <RestrictedRoute
        exact path="/" component={() => <Redirect to='/app'/>}
      />
      <RestrictedRoute
        component={FourZeroFour}
      />
    </Switch>
  </ConnectedRouter>
);
