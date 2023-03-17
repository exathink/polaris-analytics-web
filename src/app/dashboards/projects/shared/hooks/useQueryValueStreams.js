import { gql, useQuery } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_PROJECT_VALUE_STREAMS_QUERY = gql`
query with_project_instance($key: String!) {
  project(key: $key) {
    name
    key
    valueStreams {
      edges {
         node {
          key
          name
          workItemSelectors
         }
      }
    }
  }
}
`

export function useQueryProjectValueStreams({instanceKey}) {
    return useQuery(GET_PROJECT_VALUE_STREAMS_QUERY, {
      service: analytics_service,
      variables: {
        key: instanceKey,
      },
      errorPolicy: "all",
    });
  }