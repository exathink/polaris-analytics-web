import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectClosedDeliveryCycleDetail({instanceKey, days, defectsOnly, specsOnly, referenceString}) {
  return useQuery(
    gql`
     query projectClosedDeliveryCycleDetail($key: String!, $referenceString: String, $days: Int, $defectsOnly: Boolean, $specsOnly: Boolean) {
      project(
            key: $key, 
            referenceString: $referenceString,
            ) {
          workItemDeliveryCycles(
            closedWithinDays: $days,
            defectsOnly: $defectsOnly,
            specsOnly: $specsOnly,
            interfaces: [WorkItemInfo, DeliveryCycleInfo, CycleMetrics, ImplementationCost]
          ) {
               edges {
                  node {
                      
                      name
                      key
                      
                      displayId
                      workItemKey
                      workItemType
                      isBug
                    
                    
                      startDate
                      endDate
                      
                    
                      leadTime
                      cycleTime
                      latency
                      
                    
                      effort
                      duration
                      authorCount
                                              
                      
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
        specsOnly: specsOnly,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}