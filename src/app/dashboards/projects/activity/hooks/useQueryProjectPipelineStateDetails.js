import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectPipelineStateDetails({instanceKey, specsOnly, referenceString}) {
  return useQuery(
    gql`
      query projectPipelineStateDetails($key: String!, $specsOnly: Boolean, $referenceString: String) {
        project(key: $key, referenceString: $referenceString) {
          workItems (activeOnly: true, interfaces: [WorkItemStateDetails], specsOnly: $specsOnly){
            edges {
              node {
                
                name
                key
                displayId
                workItemType
                state
                stateType
              
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
                
              }
            }
        }
       }
    }
    `, {
      service: analytics_service,
      variables: {
        key: instanceKey,
        specsOnly: specsOnly,
        referenceString: referenceString

      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}