import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectCycleMetrics({instanceKey, days, targetPercentile, defectsOnly, specsOnly, referenceString}) {
  return useQuery(
    gql`
     query projectAggregateCycleMetrics($key: String!, $referenceString: String, $days: Int, $targetPercentile: Float, $defectsOnly : Boolean, $specsOnly: Boolean) {
      project(
            key: $key, 
            interfaces: [AggregateCycleMetrics],
            closedWithinDays: $days,
            cycleMetricsTargetPercentile: $targetPercentile, 
            defectsOnly: $defectsOnly,
            specsOnly: $specsOnly,
            referenceString: $referenceString,
            ) {
          
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
  `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        days: days,
        targetPercentile: targetPercentile,
        defectsOnly: defectsOnly,
        specsOnly: specsOnly,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}