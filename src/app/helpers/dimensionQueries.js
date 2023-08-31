import {gql, useQuery} from "@apollo/client";
import {analytics_service} from "../services/graphql";

export const PROJECT_QUERY = gql`
  query with_project_instance($key: String!) {
    project(
      key: $key
      interfaces: [CommitSummary, WorkItemEventSpan, PullRequestEventSpan, OrganizationRef, ProjectSetupInfo]
    ) {
      id
      name
      key
      workStreamCount
      mappedWorkStreamCount
      earliestCommit
      latestCommit
      commitCount
      latestWorkItemEvent
      latestPullRequestEvent
      organizationKey
      valueStreams {
        edges {
          node {
            key
            name
            workItemSelectors
          }
        }
      }
      settings {
        flowMetricsSettings {
          cycleTimeTarget
          leadTimeTarget
          responseTimeConfidenceTarget
          leadTimeConfidenceTarget
          cycleTimeConfidenceTarget
          includeSubTasks
        }
        analysisPeriods {
          wipAnalysisPeriod
          flowAnalysisPeriod
          trendsAnalysisPeriod
        }
        wipInspectorSettings {
          includeSubTasks
        }
        releasesSettings {
          enableReleases
        }
        customPhaseMapping {
          backlog
          open
          wip
          complete
          closed
        }
      }
    }
  }
`;

export const TEAM_QUERY = gql`
  query with_team_instance($key: String!) {
    team(key: $key, interfaces: [ContributorCount, CommitSummary, TeamInfo]) {
      id
      name
      key
      contributorCount
      earliestCommit
      latestCommit
      commitCount
      settings {
        flowMetricsSettings {
          cycleTimeTarget
          leadTimeTarget
          responseTimeConfidenceTarget
          leadTimeConfidenceTarget
          cycleTimeConfidenceTarget
          includeSubTasks
        }
        analysisPeriods {
          wipAnalysisPeriod
          flowAnalysisPeriod
          trendsAnalysisPeriod
        }
        wipInspectorSettings {
          includeSubTasks
        }
        releasesSettings {
          enableReleases
        }
      }
    }
  }
`;

export const REPOSITORY_QUERY = gql`
  query with_repository_instance($key: String!) {
    repository(key: $key, interfaces: [CommitSummary]) {
      id
      name
      key
      earliestCommit
      latestCommit
      commitCount
    }
  }
`;

export const ORGANIZATION_QUERY = gql`
  query with_organization_instance($key: String!, $referenceDate: DateTime) {
    organization(
      key: $key
      interfaces: [CommitSummary, ProjectCount, RepositoryCount, WorkItemsSourceCount, WorkItemEventSpan]
      referenceDate: $referenceDate
    ) {
      id
      name
      key
      earliestCommit
      latestCommit
      commitCount
      projectCount
      repositoryCount
      workItemsSourceCount
      earliestWorkItemEvent
      latestWorkItemEvent
      teams {
        count
      }
    }
  }
`;

const queryMap = {
  organization: ORGANIZATION_QUERY,
  project: PROJECT_QUERY,
  team: TEAM_QUERY,
  repository: REPOSITORY_QUERY,
};

export function useDimensionQuery({dimension, key, ...restProps}) {
  return useQuery(queryMap[dimension], {
    service: analytics_service,
    variables: {
      key: key,
      ...restProps,
    },
    errorPolicy: "all",
  });
}
