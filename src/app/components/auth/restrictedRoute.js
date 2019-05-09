import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import {analytics_service} from "../../services/graphql/index";
import gql from "graphql-tag";
import {Loading} from "../graphql/loading";
import {Query} from "react-apollo";
import {ViewerContext} from "../../framework/viewer/viewerContext";


import { getCookie, timestamp } from '../../helpers/utility';

export const SESSION_COOKIE_NAME = 'session_key';
export const SESSION_COOKIE_EXP_NAME = 'session_expiration';

export const getSessionKey = () => getCookie(SESSION_COOKIE_NAME);
export const getSessionExpiration = () => getCookie(SESSION_COOKIE_EXP_NAME);
export const authenticated = () => getSessionKey() && (timestamp() < getSessionExpiration());



export default ({ component: Component, ...rest  }) => (
  <Route
    {...rest}

    render={
      props => {
        if (!authenticated())
          return <Redirect to={{pathname: '/login', from: props.location.pathname}}/>;

        return (
          <ViewerContext.Provider>
            <Component {...props} />
          </ViewerContext.Provider>
        )
      }
    }
  />
);


