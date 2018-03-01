import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import authActions from './redux/auth/actions';


import App from './containers/App/App';
import Login from './components/auth/Login'; 
import Logout from './components/auth/Logout';

import { isAuthenticated } from './auth/helpers';

const {requestUserData} = authActions;

const RestrictedRoute_ = ({ component: Component, isAuthorized, requestUserData, ...rest  }) => (
  <Route
    {...rest}

    render={
      props => {
        if (isAuthenticated()) {
            if(!isAuthorized) {
                requestUserData();
            }
            return <Component {...props} />;
        }
        return <Redirect to={{pathname: '/login', from: props.location.pathname}}/>
      }
    }
  />
);

export const RestrictedRoute =  connect(state => ({
    isAuthorized: state.auth.authorized
}), {requestUserData})(RestrictedRoute_);



export default ({ history}) => (
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
      {/* This is a direct example of a private route
          that can assume that user and account is injected into its props */}
      <RestrictedRoute
        path="/foo"
        component={props => (
          <h3>Hello {props.user.last_name} from {props.account.company}</h3>
        )}
      />
    </Switch>
  </ConnectedRouter>
);
