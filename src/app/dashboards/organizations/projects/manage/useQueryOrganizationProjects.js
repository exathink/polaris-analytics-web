import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_PROJECTS_QUERY = gql`
  query organizationProjects(
    $organizationKey: String!
    $days: Int!
    $measurementWindow: Int!
    $samplingFrequency: Int!
    $specsOnly: Boolean!
    $includeSubTasks: Boolean!
  ) {
    organization(key: $organizationKey) {
      id
      projects(
        interfaces: [CommitSummary, RepositoryCount, WorkItemEventSpan, CycleMetricsTrends, ContributorCount, ArchivedStatus]
        cycleMetricsTrendsArgs: {
          days:$days,
          measurementWindow:$measurementWindow,
          samplingFrequency:$samplingFrequency,
          specsOnly: $specsOnly
          includeSubTasks: $includeSubTasks
          metrics: [avg_lead_time, avg_cycle_time, total_effort, work_items_with_commits]
        }
        contributorCountDays: 30
      ) {
        count
        edges {
          node {
            id
            name
            key
            archived
            contributorCount
            cycleMetricsTrends {
              avgLeadTime
              avgCycleTime
              totalEffort
              workItemsWithCommits
            }
            repositoryCount
            latestCommit
            latestWorkItemEvent
            workItemsSources {
              count
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

export function useQueryOrganizationProjects({organizationKey, days, measurementWindow, samplingFrequency, specsOnly, includeSubTasks}) {
  return useQuery(GET_PROJECTS_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      specsOnly: specsOnly,
      includeSubTasks: includeSubTasks,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
}
