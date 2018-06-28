import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import {ConnectedRouter} from 'react-router-redux';


import App from '../app/App';
import Login from '../app/components/auth/Login';
import Logout from '../app/components/auth/Logout';

import RestrictedRoute from './RestrictedRoute';
import FourZeroFour from "../containers/Page/404";
import {connect} from "react-redux";



const AppRedirector = connect(state => ({
    account: state.user.get('account')
  }))((props) => {
    return (<Redirect to='/app'/>);
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
