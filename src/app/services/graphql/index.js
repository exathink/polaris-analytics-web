// GraphQL Client Setup
import ApolloClient from 'apollo-boost';
import {GRAPHQL_ADMIN_URL, GRAPHQL_ANALYTICS_URL} from "../../../config/url";

export const admin_service = new ApolloClient({
  uri: GRAPHQL_ADMIN_URL,
  credentials: 'include'
});

export const analytics_service = new ApolloClient({
  uri: GRAPHQL_ANALYTICS_URL,
  credentials: 'include'
});





