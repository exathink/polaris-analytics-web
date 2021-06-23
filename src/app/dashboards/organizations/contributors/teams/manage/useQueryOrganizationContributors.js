import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export const GET_ORGANIZATION_CONTRIBUTORS_QUERY = gql`
  query getOrganizationContributors($key: String!, $commitWithinDays: Int) {
    organization(key: $key) {
      contributors(interfaces: [TeamNodeRef, CommitSummary], commitWithinDays: $commitWithinDays) {
        edges {
          node {
            name
            key
            teamName
            teamKey
            earliestCommit
            latestCommit
            commitCount
          }
        }
      }
    }
  }
`;

export function useQueryOrganizationContributors({organizationKey, commitWithinDays}) {
  return useQuery(GET_ORGANIZATION_CONTRIBUTORS_QUERY, {
    service: analytics_service,
    variables: {
      key: organizationKey,
      commitWithinDays: commitWithinDays,
    },
    errorPolicy: "all",
  });
}
