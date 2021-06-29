import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../../services/graphql";

export const GET_CONTRIBUTOR_ALIASES_INFO_QUERY = (dimension) => gql`
  query getContributorAliasesInfo($key: String!, $commitWithinDays: Int) {
    ${dimension}(key: $key) {
      contributors(interfaces: [CommitSummary, ContributorAliasesInfo], commitWithinDays: $commitWithinDays) {
        edges {
          node {
            id
            key
            name
            earliestCommit
            latestCommit
            commitCount
            contributorAliasesInfo {
              key
              name
              alias
              latestCommit
              earliestCommit
              commitCount
            }
          }
        }
      }
    }
  }
`;

export function useQueryContributorAliasesInfo({dimension, instanceKey, commitWithinDays}) {
  return useQuery(GET_CONTRIBUTOR_ALIASES_INFO_QUERY(dimension), {
    service: analytics_service,
    variables: {
      key: instanceKey,
      commitWithinDays: commitWithinDays,
    },
    errorPolicy: "all",
  });
}
