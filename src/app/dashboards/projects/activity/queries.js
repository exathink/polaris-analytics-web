import gql from "graphql-tag";

export const PROJECT_CLOSED_DELIVERY_CYCLES_DETAIL = gql`
     query projectClosedDeliveryCycleDetail($key: String!, $referenceString: String, $days: Int) {
      project(
            key: $key, 
            referenceString: $referenceString,
            ) {
          id
          workItemDeliveryCycles(
            closedWithinDays: $days,
            interfaces: [WorkItemInfo, DeliveryCycleInfo, CycleMetrics]
          ) {
               edges {
                  node {
                      id
                      name
                      key
                      ... on WorkItemInfo {
                        displayId
                        workItemType
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
`