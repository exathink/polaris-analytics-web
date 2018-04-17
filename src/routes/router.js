import React from 'react';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import {ConnectedRouter, getLocation, push, replace, go, goBack, goForward} from 'react-router-redux';
import {connect} from 'react-redux';


import App from '../app/App';
import Login from '../components/auth/Login';
import Logout from '../components/auth/Logout';

import RestrictedRoute from './RestrictedRoute';
import FourZeroFour from "../containers/Page/404";

export const withRouterConnection = (Component) => {
  const mapStateToProps = (state, ownProps) => ({
      ...ownProps,
    location: getLocation(state),
  });
  const mapDispatchToProps = (dispatch) => (
    {
      navigate:
        {
          push: (args) => {
            dispatch(push(args))
          },
          replace: (args) => {
            dispatch(replace(args))
          },
          go: (args) => {
            dispatch(go(args))
          },
          goBack: (args) => {
            dispatch(goBack(args))
          },
          goForward: (args) => {
            dispatch(goForward(args))
          }
        }
    });
  return withRouter(connect(mapStateToProps, mapDispatchToProps)(Component))
};

class AppRedirector extends React.Component {
  render() {
    return (<Redirect to='/app'/>);
  }

}

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
