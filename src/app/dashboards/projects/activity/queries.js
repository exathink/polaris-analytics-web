import gql from "graphql-tag";

export const PROJECT_WORK_ITEM_SUMMARIES = gql`
     query projectWorkItemSummaries($key: String!, $referenceString: String) {
      project(key: $key, interfaces: [WorkItemStateTypeCounts], referenceString: $referenceString) {
          id
          ... on WorkItemStateTypeCounts {
            workItemStateTypeCounts {
              backlog
              open
              wip
              complete
              closed
              unmapped
          }
         }
          
      }
     }
`

export const PROJECT_CYCLE_METRICS = gql`
     query projectAggregateCycleMetrics($key: String!, $referenceString: String, $days: Int, $targetPercentile: Float) {
      project(
            key: $key, 
            interfaces: [AggregateCycleMetrics],
            closedWithinDays: $days,
            cycleMetricsTargetPercentile: $targetPercentile, 
            referenceString: $referenceString,
            ) {
          id
          ... on AggregateCycleMetrics {
                minLeadTime
                avgLeadTime
                maxLeadTime
                minCycleTime
                avgCycleTime
                maxCycleTime
                percentileLeadTime
                percentileCycleTime
                targetPercentile
                workItemsInScope
                workItemsWithNullCycleTime
                earliestClosedDate
                latestClosedDate
         }
      }
     }
`

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