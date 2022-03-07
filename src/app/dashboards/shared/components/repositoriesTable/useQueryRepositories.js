import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_REPOSITORIES_QUERY = (dimension) => gql`
query dimensionRepositories($instanceKey: String!) {
  ${dimension}(key: $instanceKey) {
      id
      repositories (
        interfaces: [CommitSummary, ContributorCount, TraceabilityTrends], 
        traceabilityTrendsArgs: {
          measurementWindow: 30, 
          days:30, 
          samplingFrequency: 30
        }
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
                    traceabilityTrends {
                      measurementDate
                      measurementWindow
                      traceability
                      specCount
                      nospecCount
                      totalCommits
                    }
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
