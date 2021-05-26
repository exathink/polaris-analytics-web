import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const WORK_ITEM_WITH_INSTANCE = gql`
  query with_work_item_instance($key: String!) {
    workItem(key: $key, interfaces: [CommitSummary, WorkItemEventSpan, WorkItemsSourceRef]) {
      id
      name
      key
      url
      displayId
      workItemType
      state
      stateType
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
