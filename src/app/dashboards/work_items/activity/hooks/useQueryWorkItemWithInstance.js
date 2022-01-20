import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const WORK_ITEM_WITH_INSTANCE = gql`
  query with_work_item_instance($key: String!) {
    workItem(key: $key, interfaces: [CommitSummary, WorkItemEventSpan, WorkItemsSourceRef, EpicNodeRef, WorkItemStateDetails]) {
      id
      name
      key
      url
      displayId
      workItemType
      state
      stateType
      epicName
      ... on WorkItemStateDetails {
        workItemStateDetails {
          currentStateTransition {
            eventDate
          }
          currentDeliveryCycleDurations {
            state
            stateType
            daysInState
          }
        }
      }
      earliestCommit
      latestCommit
      commitCount
      latestWorkItemEvent
      workTrackingIntegrationType
    }
  }
`;

export function useQueryWorkItemWithInstance({workItemKey}) {
  return useQuery(WORK_ITEM_WITH_INSTANCE, {
    service: analytics_service,
    variables: {
      key: workItemKey,
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}
