import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectClosedDeliveryCycleDetail({instanceKey, days, defectsOnly, referenceString}) {
  return useQuery(
    gql`
     query projectClosedDeliveryCycleDetail($key: String!, $referenceString: String, $days: Int, $defectsOnly: Boolean) {
      project(
            key: $key, 
            referenceString: $referenceString,
            ) {
          id
          workItemDeliveryCycles(
            closedWithinDays: $days,
            defectsOnly: $defectsOnly,
            interfaces: [WorkItemInfo, DeliveryCycleInfo, CycleMetrics]
          ) {
               edges {
                  node {
                      
                      name
                      key
                      ... on WorkItemInfo {
                        displayId
                        workItemKey
                        workItemType
                        isBug
                      }
                      ... on DeliveryCycleInfo {
                        startDate
                        endDate
                        
                      }
                      ... on CycleMetrics {
                        leadTime
                        cycleTime
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
        days: days,
        defectsOnly: defectsOnly,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}