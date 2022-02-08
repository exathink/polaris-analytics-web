import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const GET_PROJECTS_QUERY = gql`
  query organizationProjects($organizationKey: String!) {
    organization(key: $organizationKey) {
      id
      projects(
        interfaces: [CommitSummary, RepositoryCount, WorkItemEventSpan, CycleMetricsTrends, ContributorCount]
        cycleMetricsTrendsArgs: {
          days: 30
          measurementWindow: 30
          samplingFrequency: 30
          metrics: [avg_lead_time, avg_cycle_time, total_effort, work_items_in_scope]
        }
        contributorCountDays: 30
      ) {
        count
        edges {
          node {
            id
            name
            key
            contributorCount
            cycleMetricsTrends {
              avgLeadTime
              avgCycleTime
              totalEffort
              workItemsInScope
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

export function useQueryOrganizationProjects({organizationKey}) {
  return useQuery(GET_PROJECTS_QUERY, {
    service: analytics_service,
    variables: {
      organizationKey: organizationKey,
    },
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
}
