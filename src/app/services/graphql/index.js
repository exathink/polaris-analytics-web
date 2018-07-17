// GraphQL Client Setup
import React from 'react';

import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import {GRAPHQL_ADMIN_URL, GRAPHQL_ANALYTICS_URL} from "../../../config/url";




export const admin_service = new ApolloClient({
  uri: GRAPHQL_ADMIN_URL,
  credentials: 'include'
});

export const analytics_service = new ApolloClient({
  uri: GRAPHQL_ANALYTICS_URL,
  credentials: 'include'
});


export const AdminServiceProvider = props => (
  <ApolloProvider client={admin_service}>
    {props.children}
  </ApolloProvider>
);

export const AnalyticsServiceProvider = props => (
  <ApolloProvider client={analytics_service}>
    { props.children }
  </ApolloProvider>
);


