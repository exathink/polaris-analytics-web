// GraphQL Client Setup
import React from 'react';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";

import analyticsFragmentTypes from '../../../config/graphql/analyticsFragmentTypes.json';
import workTrackingFragmentTypes from "../../../config/graphql/workTrackingFragmentTypes.json";
import vcsFragmentTypes from "../../../config/graphql/vcsFragmentTypes.json";

import {GRAPHQL_ANALYTICS_URL, GRAPHQL_WORK_TRACKING_URL, GRAPHQL_VCS_URL} from "../../../config/url";

export const defaultPollInterval = service => {
  return 0;
};

/**
 *  TODO:
    fragmentMatcher is supposed to be replaced by possibleTypes in latest version
    for more details refer: https://github.com/apollographql/apollo-client/pull/5073
 */
export const analytics_service = new ApolloClient({
  cache: new InMemoryCache({
    // possibleTypes:analyticsFragmentTypes
  }),
  uri: GRAPHQL_ANALYTICS_URL,
  credentials: 'include',
});
analytics_service.defaultPollInterval = () => defaultPollInterval(analytics_service);

export const work_tracking_service = new ApolloClient({
  cache: new InMemoryCache({
    // possibleTypes: workTrackingFragmentTypes
  }),
  uri: GRAPHQL_WORK_TRACKING_URL,
  credentials: 'include',
});
analytics_service.defaultPollInterval = () => defaultPollInterval(work_tracking_service);

export const vcs_service = new ApolloClient({
  cache: new InMemoryCache({
    // possibleTypes: vcsFragmentTypes
  }),
  uri: GRAPHQL_VCS_URL,
  credentials: 'include',
});
vcs_service.defaultPollInterval = () => defaultPollInterval(vcs_service);


export const DefaultApolloProvider = props => (
  <ApolloProvider client={analytics_service}>
    {props.children}
  </ApolloProvider>
);




