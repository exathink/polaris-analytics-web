import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_REPOSITORIES_QUERY = (dimension) => gql`
query dimensionRepositories($instanceKey: String!, $days: Int!, $showExcluded: Boolean) {
  ${dimension}(key: $instanceKey) {
      id
      repositories (
        interfaces: [CommitSummary, ContributorCount, TraceabilityTrends, Excluded], 
        traceabilityTrendsArgs: {
          measurementWindow: $days, 
          days:$days, 
          samplingFrequency: $days,  
        }, 
        contributorCountDays: $days
        showExcluded: $showExcluded
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
                    excluded
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

export function useQueryRepositories({dimension, instanceKey, days, showExcluded}) {
  return useQuery(GET_REPOSITORIES_QUERY(dimension), {
    service: analytics_service,
    variables: {
      instanceKey: instanceKey,
      days: days,
      showExcluded: showExcluded
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network"
  });
}
