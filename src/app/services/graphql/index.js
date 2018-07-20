// GraphQL Client Setup
import React from 'react';
import ApolloClient from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';

import analyticsFragmentTypes from '../../../config/graphql/analyticsFragmentTypes.json';
import adminFragmentTypes from '../../../config/graphql/adminFragmentTypes';


import {GRAPHQL_ADMIN_URL, GRAPHQL_ANALYTICS_URL} from "../../../config/url";

import {ApolloProvider} from 'react-apollo';

export const analytics_service = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: analyticsFragmentTypes
    })
  }),
  link: new HttpLink({
    uri: GRAPHQL_ANALYTICS_URL,
    credentials: 'include',
  })
});

export const admin_service = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: adminFragmentTypes
    })
  }),
  link: new HttpLink({
    uri: GRAPHQL_ADMIN_URL,
    credentials: 'include',
  })
});


export const DefaultApolloProvider = props => (
  <ApolloProvider client={analytics_service}>
    {props.children}
  </ApolloProvider>
);




