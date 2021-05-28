import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const PROJECT_PIPELINE_STATE_DETAILS = gql`
  query projectPipelineStateDetails(
    $key: String!
    $specsOnly: Boolean
    $referenceString: String
    $closedWithinDays: Int
    $activeOnly: Boolean
    $funnelView: Boolean
    $includeSubTasksInClosedState: Boolean
    $includeSubTasksInNonClosedState: Boolean
  ) {
    project(key: $key, referenceString: $referenceString) {
      id
      workItems(
        activeOnly: $activeOnly
        closedWithinDays: $closedWithinDays
        interfaces: [WorkItemStateDetails, WorkItemsSourceRef]
        specsOnly: $specsOnly

        funnelView: $funnelView
        funnelViewArgs: {
          includeSubTasksInClosedState: $includeSubTasksInClosedState
          includeSubTasksInNonClosedState: $includeSubTasksInNonClosedState
        }
        referenceString: $referenceString
      ) {
        edges {
          node {
            id
            name
            key
            displayId
            workItemType
            state
            stateType
            workItemsSourceKey
            workItemsSourceName
            workItemStateDetails {
              currentStateTransition {
                eventDate
              }
              currentDeliveryCycleDurations {
                state
                stateType
                daysInState
              }
              earliestCommit
              latestCommit
              commitCount
              effort
              duration
            }
          }
        }
      }
    }
  }
`;

export function useQueryProjectPipelineStateDetails({
  instanceKey,
  specsOnly,
  referenceString,
  closedWithinDays,
  activeOnly,
  funnelView,
  includeSubTasks: {includeSubTasksInClosedState, includeSubTasksInNonClosedState},
}) {
  return useQuery(PROJECT_PIPELINE_STATE_DETAILS, {
    service: analytics_service,
    variables: {
      key: instanceKey,
      specsOnly: specsOnly,
      referenceString: referenceString,
      closedWithinDays: closedWithinDays,
      activeOnly: activeOnly,
      funnelView: funnelView,
      includeSubTasksInClosedState: includeSubTasksInClosedState,
      includeSubTasksInNonClosedState: includeSubTasksInNonClosedState,
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}
