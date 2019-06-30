// GraphQL Client Setup
import React from 'react';
import ApolloClient from 'apollo-client';
import {InMemoryCache, IntrospectionFragmentMatcher} from 'apollo-cache-inmemory';
import {HttpLink} from 'apollo-link-http';

import analyticsFragmentTypes from '../../../config/graphql/analyticsFragmentTypes.json';
import workTrackingFragmentTypes from "../../../config/graphql/workTrackingFragmentTypes.json";


import {GRAPHQL_ANALYTICS_URL, GRAPHQL_WORK_TRACKING_URL} from "../../../config/url";

import {ApolloProvider} from 'react-apollo';

export const defaultPollInterval = service => {
  return 0;
};

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
analytics_service.defaultPollInterval = () => defaultPollInterval(analytics_service);

export const work_tracking_service = new ApolloClient({
  cache: new InMemoryCache({
    fragmentMatcher: new IntrospectionFragmentMatcher({
      introspectionQueryResultData: workTrackingFragmentTypes
    })
  }),
  link: new HttpLink({
    uri: GRAPHQL_WORK_TRACKING_URL,
    credentials: 'include',
  })
});
analytics_service.defaultPollInterval = () => defaultPollInterval(work_tracking_service);


export const DefaultApolloProvider = props => (
  <ApolloProvider client={analytics_service}>
    {props.children}
  </ApolloProvider>
);




