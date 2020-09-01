import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectPipelineCycleMetrics({instanceKey, days, targetPercentile, specsOnly, defectsOnly, referenceString}) {
  return useQuery(
    gql`
     query projectPipelineCycleMetrics($key: String!, $referenceString: String, $targetPercentile: Float, $specsOnly: Boolean, $defectsOnly : Boolean) {
      project(
            key: $key, 
            interfaces: [PipelineCycleMetrics],
            pipelineCycleMetricsArgs: {
              metrics: [
                avg_cycle_time,
                work_items_in_scope,
                work_items_with_commits,
                percentile_lead_time,
                total_effort,
                avg_duration
              ],
              defectsOnly: $defectsOnly,
              specsOnly: $specsOnly,
              leadTimeTargetPercentile: $targetPercentile
            },
            referenceString: $referenceString
          ) {
          pipelineCycleMetrics {
                avgCycleTime
                percentileLeadTime
                targetPercentile
                workItemsWithCommits
                workItemsInScope
                totalEffort
                avgDuration
         }
      }
     }
  `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
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