import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export const PROJECT_PIPELINE_STATE_DETAILS = gql`
  query projectPipelineStateDetails(
    $key: String!
    $specsOnly: Boolean
    $referenceString: String
    $closedWithinDays: Int
    $activeOnly: Boolean,
    $funnelView: Boolean,
  ) {
    project(key: $key, referenceString: $referenceString) {
      id
      workItems(
        activeOnly: $activeOnly
        closedWithinDays: $closedWithinDays
        interfaces: [WorkItemStateDetails]
        specsOnly: $specsOnly
        funnelView: $funnelView
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
}) {
  return useQuery(PROJECT_PIPELINE_STATE_DETAILS, {
    service: analytics_service,
    variables: {
      key: instanceKey,
      specsOnly: specsOnly,
      referenceString: referenceString,
      closedWithinDays: closedWithinDays,
      activeOnly: activeOnly,
      funnelView: funnelView
    },
    errorPolicy: "all",
    pollInterval: analytics_service.defaultPollInterval(),
  });
}
