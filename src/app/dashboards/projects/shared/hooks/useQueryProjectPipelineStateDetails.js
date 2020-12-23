import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectPipelineStateDetails({instanceKey, specsOnly, referenceString, closedWithinDays, activeOnly}) {
  return useQuery(
    gql`
      query projectPipelineStateDetails($key: String!, $specsOnly: Boolean, $referenceString: String, $closedWithinDays: Int, $activeOnly: Boolean) {
        project(key: $key, referenceString: $referenceString) {
          id
          workItems(
            activeOnly: $activeOnly
            closedWithinDays: $closedWithinDays
            interfaces: [WorkItemStateDetails]
            specsOnly: $specsOnly
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
    `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        specsOnly: specsOnly,
        referenceString: referenceString,
        closedWithinDays: closedWithinDays,
        activeOnly: activeOnly
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval(),
    }
  );
}
