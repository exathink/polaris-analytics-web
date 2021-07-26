import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_ORGANIZATION_TEAMS_QUERY = gql`
  query getOrganizationTeamsInfo(
      $organizationKey: String!,
      $days: Int!,
      $measurementWindow: Int!,
      $samplingFrequency: Int!,
      $specsOnly: Boolean!,
      $includeSubTasks: Boolean!, 
  ) {
    organization(key: $organizationKey) {
      teams (interfaces: [ContributorCount, CommitSummary, CycleMetricsTrends], cycleMetricsTrendsArgs: {
          days:$days,
          measurementWindow:$measurementWindow,
          samplingFrequency:$samplingFrequency,
          metrics:[
              avg_cycle_time, 
              avg_lead_time,
              avg_duration,
              avg_latency,
              avg_effort,
              work_items_in_scope,
              total_effort
      ]
      specsOnly:$specsOnly,
      includeSubTasks: $includeSubTasks
      }){
        edges {
          node {
            name
            key
            contributorCount
            latestCommit
            cycleMetricsTrends {
                measurementDate
                measurementWindow
                avgLeadTime 
                avgCycleTime
                avgDuration
                avgLatency
                avgEffort
                totalEffort
                workItemsInScope
            }
          }
        }
      }
    }
  }
`;

export function useQueryOrganizationTeams({organizationKey, days, measurementWindow, samplingFrequency, specsOnly, includeSubTasks}) {
  return useQuery(GET_ORGANIZATION_TEAMS_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      specsOnly: specsOnly,
      includeSubTasks: includeSubTasks
    },
    errorPolicy: "all",
  });
}
