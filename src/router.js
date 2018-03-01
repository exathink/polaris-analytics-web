import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { connect } from 'react-redux';

import authActions from './redux/auth/actions';
import { store } from './redux/store';

import App from './containers/App/App';
import Login from './components/auth/Login'; 
import Logout from './components/auth/Logout';

import { checkAuth } from './auth/helpers';

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest  }) => (
  <Route
    {...rest}

    render={
      props => {
        {/* Yeah, I know the bellow if's are a little weird and I hope I can improve it, lol */}

        if (isLoggedIn) {
          return <Component {...props} />;
        }

        if (checkAuth()) {
          store.dispatch(authActions.requestUserData());
          return <Component {...props} />;
        }

        return <Redirect to={{ pathname: '/login', from: props.location.pathname }}/>
      }
    }

  />
);

export const PublicRoutes = ({ history, isLoggedIn }) => (
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

export default connect(state => ({
  isLoggedIn: state.auth.authorized
}))(PublicRoutes)
