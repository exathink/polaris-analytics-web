import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_REPOSITORIES_QUERY = (dimension) => gql`
query dimensionRepositories($instanceKey: String!, $days: Int!) {
  ${dimension}(key: $instanceKey) {
      id
      repositories (
        interfaces: [CommitSummary, ContributorCount], 
        contributorCountDays: $days
        ){
            count
            edges {
                node {
                    id
                    name
                    key
                    description
                    earliestCommit
                    latestCommit
                    commitCount
                    contributorCount
                }
            }
        }
   }
  }
`

export function useQueryRepositories({dimension, instanceKey, days}) {
  return useQuery(GET_REPOSITORIES_QUERY(dimension), {
    service: analytics_service,
    variables: {
      instanceKey: instanceKey,
      days: days
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network"
  });
}
