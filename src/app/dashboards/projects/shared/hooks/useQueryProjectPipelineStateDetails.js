import {useQuery, gql} from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectPipelineStateDetails({instanceKey, specsOnly, referenceString}) {
  return useQuery(
    gql`
      query projectPipelineStateDetails($key: String!, $specsOnly: Boolean, $referenceString: String) {
        project(key: $key, referenceString: $referenceString) {
          id
          workItems(
            activeOnly: true
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
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval(),
    }
  );
}
