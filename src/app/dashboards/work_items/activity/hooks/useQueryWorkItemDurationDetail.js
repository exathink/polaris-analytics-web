import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export function useQueryWorkItemDurationDetail({instanceKey, referenceString}) {
  return useQuery(
    gql`
      query workItemDurationDetail($key: String!, $referenceString: String) {
        workItem(key: $key, interfaces: [WorkItemStateDetails], referenceString: $referenceString){
              id
              name
              key
              displayId
              description
              workItemType
              state
              stateType
              ... on WorkItemStateDetails {
                workItemStateDetails {
                  startDate
                  endDate
                  closed
                  leadTime
                  cycleTime
                  currentStateTransition {
                    seqNo
                    newState
                    previousState
                    eventDate
                  }
                  currentDeliveryCycleDurations {
                    state
                    stateType
                    daysInState
                    flowType
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