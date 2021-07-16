import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_REPOSITORIES_QUERY = (dimension) => gql`
query dimensionRepositories($instanceKey: String!) {
  ${dimension}(key: $instanceKey) {
      id
      repositories (interfaces: [CommitSummary, ContributorCount]){
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

export function useQueryRepositories({dimension, instanceKey}) {
  return useQuery(GET_REPOSITORIES_QUERY(dimension), {
    service: analytics_service,
    variables: {
      instanceKey: instanceKey,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network"
  });
}
