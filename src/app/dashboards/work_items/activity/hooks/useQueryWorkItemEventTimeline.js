import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export function useQueryWorkItemEventTimeline({instanceKey, latestWorkItemEvent, latestWorkItemCommit}) {
  const referenceString = `${latestWorkItemEvent || ""}${latestWorkItemCommit || ""}`;
  return useQuery(
    gql`
      query workItem_workItemEvents($key: String!, $referenceString: String) {
        workItem(key: $key, referenceString: $referenceString) {
          id
          name
          displayId
          workItemType
          state
          stateType
          workItemEvents {
            count
            edges {
              node {
                id
                state
                eventDate
                previousState
                previousStateType
                newState
                newStateType
              }
            }
          }
          commits {
            count
            edges {
              node {
                name
                key
                commitHash
                commitMessage
                commitDate
                committer
                author
                authorDate
                numParents
                branch
                repository
                repositoryUrl
                integrationType
              }
            }
          }
          pullRequests(interfaces: [BranchRef]) {
            edges {
              node {
                id
                name
                key
                displayId
                state
                age
                createdAt
                endDate
                webUrl
                repositoryName
                branchName
              }
            }
          }
          workItemDeliveryCycles(interfaces: [DeliveryCycleInfo, CycleMetrics]) {
              edges {
                  node {
                      endDate
                      leadTime
                      cycleTime
                  }
              }
          }
        }
      }
    `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        referenceString: referenceString,
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval(),
    }
  );
}
