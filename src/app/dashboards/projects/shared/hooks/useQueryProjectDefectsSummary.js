import { useQuery, gql } from "@apollo/client";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectDefectMetricsSummary({instanceKey, days, targetPercentile, referenceString}) {
  return useQuery(
    gql`
           query projectDefectMetricsSummary($key: String!, $days: Int!, $targetPercentile: Float!, $referenceString: String!) {
            project(key: $key, 
                    interfaces: [AggregateCycleMetrics, WorkItemStateTypeAggregateMetrics], 
                    defectsOnly: true,
                    cycleMetricsTargetPercentile: $targetPercentile,
                    closedWithinDays: $days,
                    referenceString: $referenceString, 
                    ) {
                
                ... on AggregateCycleMetrics {
                    minLeadTime
                    avgLeadTime
                    maxLeadTime
                    percentileLeadTime
                    minCycleTime
                    avgCycleTime
                    maxCycleTime
                    percentileCycleTime
                    workItemsInScope
                    targetPercentile
                }
                
                workItemStateTypeCounts {
                  backlog
                  open
                  wip
                  complete
                  closed
                }
                
            }
           }
      `, {

      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        targetPercentile: targetPercentile,
        referenceString: referenceString

      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}
