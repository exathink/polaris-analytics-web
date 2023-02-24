import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";
import {getReferenceString} from "../../../../helpers/utility";

export const GET_ORGANIZATION_TEAMS_QUERY = gql`
  query getOrganizationTeamsInfo(
      $organizationKey: String!,
      $days: Int!,
      $measurementWindow: Int!,
      $samplingFrequency: Int!,
      $specsOnly: Boolean!,
      $includeSubTasks: Boolean!, 
      $referenceString: String!
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
              work_items_with_commits,
              total_effort
      ]
      specsOnly:$specsOnly,
      includeSubTasks: $includeSubTasks,
      },
      referenceString: $referenceString
      ){
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
                workItemsWithCommits
            }
          }
        }
      }
    }
  }
`;

export function useQueryOrganizationTeams({organizationKey, days, measurementWindow, samplingFrequency, specsOnly, includeSubTasks, latestCommit, latestWorkItemEvent}) {
  return useQuery(GET_ORGANIZATION_TEAMS_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
      days: days ||30,
      measurementWindow: measurementWindow || 30,
      samplingFrequency: samplingFrequency || 30,
      specsOnly: specsOnly || false,
      includeSubTasks: includeSubTasks || false,
      referenceString: getReferenceString(latestCommit, latestWorkItemEvent)
    },
    errorPolicy: "all",
  });
}
