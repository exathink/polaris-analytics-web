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
                }
               }
                
            }
           }
      `

export const PROJECT_CYCLE_METRICS = gql`
           query projectCycleMetrics($key: String!, $referenceString: String, $days: Int, $targetPercentile: Float) {
            project(
                  key: $key, 
                  interfaces: [CycleMetrics],
                  cycleMetricsDays: $days,
                  cycleMetricsTargetPercentile: $targetPercentile, 
                  referenceString: $referenceString,
                  ) {
                id
                ... on CycleMetrics {
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