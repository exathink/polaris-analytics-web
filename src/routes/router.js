import React from 'react';
import {Redirect, Route, Switch, BrowserRouter} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';


import App from '../app/app';
import Login from '../app/components/auth/Login';
import Logout from '../app/components/auth/Logout';

import RestrictedRoute from './restrictedRoute';
import FourZeroFour from "../containers/Page/404";
import {connect} from "react-redux";
import Register from "../app/components/auth/Registration";


const AppRedirector = connect(state => ({
    account: state.user.get('account')
  }))((props) => {
    const account = props.account;
    if (account.initialized) {
        return (<Redirect to='/app'/>);
    } else {
      return (<Redirect to='/register'/>)
    }
});



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
        path="/register"
        component={Register}
      />
      <RestrictedRoute
        path="/app"
        component={App}
      />
      <RestrictedRoute
        exact path="/" component={AppRedirector}
      />
      <RestrictedRoute
        component={FourZeroFour}
      />
    </Switch>
  </ConnectedRouter>
);
