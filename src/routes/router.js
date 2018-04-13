import React from 'react';
import {Route, Switch, Redirect} from 'react-router-dom';
import {ConnectedRouter, getLocation, push, replace, go, goBack, goForward} from 'react-router-redux';
import {connect} from 'react-redux';


import App from '../containers/App/App';
import Login from '../components/auth/Login';
import Logout from '../components/auth/Logout';

import RestrictedRoute from './RestrictedRoute';

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
  return connect(mapStateToProps, mapDispatchToProps)(Component)
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
    </Switch>
  </ConnectedRouter>
);
