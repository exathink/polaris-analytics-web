import { gql, useQuery } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_PROJECT_RELEASES_QUERY = gql`
query projectReleases($projectKey: String!, $releasesWindow: Int!) {
  project(key: $projectKey, interfaces: [Releases], releasesActiveWithinDays: $releasesWindow) {
    name
    key
    releases
  }
}
`

export function useQueryReleases({projectKey, releasesWindow}) {
    return useQuery(GET_PROJECT_RELEASES_QUERY, {
      service: analytics_service,
      variables: {
        projectKey,
        releasesWindow
      },
      errorPolicy: "all",
    });
  }