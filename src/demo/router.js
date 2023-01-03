import React from 'react';
import {Redirect, Route, Router, Switch} from 'react-router-dom';
import {createBrowserHistory} from "history";


import App from './app';
import Login from '../app/components/auth/Login';
import Logout from '../app/components/auth/Logout';

import RestrictedRoute from '../app/components/auth/restrictedRoute';
import FourZeroFour from "../containers/Page/404";
import ReactGA from "react-ga";

const history = createBrowserHistory();

history.listen((location) => {
    ReactGA.set({page: location.pathname});
    ReactGA.pageview(location.pathname);
  }
);


const Routes = () => (
  <Router history={history}>
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
  </Router>
);

export default Routes;