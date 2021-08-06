// GraphQL Client Setup
import React from "react";
import {ApolloClient, ApolloProvider, from, HttpLink, InMemoryCache} from "@apollo/client";

import analyticsFragmentTypes from "../../../config/graphql/analyticsFragmentTypes.json";
import workTrackingFragmentTypes from "../../../config/graphql/workTrackingFragmentTypes.json";
import vcsFragmentTypes from "../../../config/graphql/vcsFragmentTypes.json";
import {onError} from "@apollo/client/link/error";
import {GRAPHQL_ANALYTICS_URL, GRAPHQL_WORK_TRACKING_URL, GRAPHQL_VCS_URL} from "../../../config/url";

export const defaultPollInterval = (service) => {
  return 0;
};

function logout() {
  window.location.replace("/logout");
}

const logoutLink = onError(({networkError}) => {
  // this is not very stable check, this is all we have currently
  // need to discuss on this, how we can make it more stable
  if (networkError.message === "Failed to fetch") {
    logout();
  }
});
const httpLink = new HttpLink({uri: GRAPHQL_ANALYTICS_URL, credentials: "include"});

/**
 *  TODO:
    fragmentMatcher is supposed to be replaced by possibleTypes in latest version
    for more details refer: https://github.com/apollographql/apollo-client/pull/5073
 */
const analyticsPossibleTypes = analyticsFragmentTypes.__schema.types.reduce((acc, item) => {
  acc[item.name] = item.possibleTypes.map((x) => x.name);
  return acc;
}, {});
export const analytics_service = new ApolloClient({
  link: from([logoutLink, httpLink]),
  cache: new InMemoryCache({
    possibleTypes: analyticsPossibleTypes,
  }),
  uri: GRAPHQL_ANALYTICS_URL,
  credentials: "include",
});
analytics_service.defaultPollInterval = () => defaultPollInterval(analytics_service);

const workTrackingPossibleTypes = workTrackingFragmentTypes.__schema.types.reduce((acc, item) => {
  acc[item.name] = item.possibleTypes.map((x) => x.name);
  return acc;
}, {});
export const work_tracking_service = new ApolloClient({
  cache: new InMemoryCache({
    possibleTypes: workTrackingPossibleTypes,
  }),
  uri: GRAPHQL_WORK_TRACKING_URL,
  credentials: "include",
});
work_tracking_service.defaultPollInterval = () => defaultPollInterval(work_tracking_service);

const vcsPossibleTypes = vcsFragmentTypes.__schema.types.reduce((acc, item) => {
  acc[item.name] = item.possibleTypes.map((x) => x.name);
  return acc;
}, {});
export const vcs_service = new ApolloClient({
  cache: new InMemoryCache({
    possibleTypes: vcsPossibleTypes,
  }),
  uri: GRAPHQL_VCS_URL,
  credentials: "include",
});
vcs_service.defaultPollInterval = () => defaultPollInterval(vcs_service);

export const DefaultApolloProvider = (props) => (
  <ApolloProvider client={analytics_service}>{props.children}</ApolloProvider>
);
