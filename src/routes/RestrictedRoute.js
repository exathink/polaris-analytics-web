import React from 'react';
import { connect } from 'react-redux';
import { authenticated } from '../app/services/auth/helpers';
import authActions from '../redux/auth/actions';
import { Route, Redirect } from 'react-router-dom';

const { requestUserData } = authActions;

const RestrictedRoute = ({ component: Component, authorized, requestUserData, ...rest  }) => (
  <Route
    {...rest}

    render={
      props => {
        if (!authenticated())
          return <Redirect to={{pathname: '/login', from: props.location.pathname}}/>;

        if(!authorized) {
          requestUserData();
          return null;
        }

        return <Component {...props} />;
      }
    }
  />
);

const mapStateToProps = state => ({
  authorized: state.auth.get('authorized')
});

export default connect(mapStateToProps, { requestUserData })(RestrictedRoute);
