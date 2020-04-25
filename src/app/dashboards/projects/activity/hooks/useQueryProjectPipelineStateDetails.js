import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectPipelineStateDetails({instanceKey, referenceString}) {
  return useQuery(
    gql`
      query projectPipelineStateDetails($key: String!, $referenceString: String) {
        project(key: $key, referenceString: $referenceString) {
          workItems (activeOnly: true, interfaces: [WorkItemStateDetails]){
            edges {
              node {
                id
                name
                key
                displayId
                description
                state
                stateType
                
                ... on WorkItemStateDetails {
                  workItemStateDetails {
                    currentStateTransition {
                      eventDate
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
        referenceString: referenceString

      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}