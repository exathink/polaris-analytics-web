import React from 'react';
import { connect } from 'react-redux';
import { authenticated } from '../app/services/auth/helpers';
import { Route, Redirect } from 'react-router-dom';
import {analytics_service} from "../app/services/graphql";
import gql from "graphql-tag";
import {Loading} from "../app/components/graphql/loading";
import {Query} from "react-apollo";
import {ViewerContext} from "../app/framework/viewer/viewerContext";





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


