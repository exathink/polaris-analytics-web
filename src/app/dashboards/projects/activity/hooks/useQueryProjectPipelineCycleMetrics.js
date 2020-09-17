import {useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {analytics_service} from "../../../../services/graphql";

export function useQueryProjectPipelineCycleMetrics({instanceKey, days, leadTimeTargetPercentile, cycleTimeTargetPercentile, specsOnly, defectsOnly, referenceString}) {
  return useQuery(
    gql`
     query projectPipelineCycleMetrics(
         $key: String!, 
         $referenceString: String, 
         $leadTimeTargetPercentile: Float,
         $cycleTimeTargetPercentile: Float,
         $specsOnly: Boolean, 
         $defectsOnly : Boolean) {
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
                avg_duration,
                percentile_duration
              ],
              defectsOnly: $defectsOnly,
              specsOnly: $specsOnly,
              leadTimeTargetPercentile: $leadTimeTargetPercentile,
              durationTargetPercentile: $cycleTimeTargetPercentile,
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
                percentileDuration
         }
      }
     }
  `,
    {
      service: analytics_service,
      variables: {
        key: instanceKey,
        leadTimeTargetPercentile: leadTimeTargetPercentile,
        cycleTimeTargetPercentile: cycleTimeTargetPercentile,
        defectsOnly: defectsOnly,
        specsOnly: specsOnly,
        referenceString: referenceString
      },
      errorPolicy: "all",
      pollInterval: analytics_service.defaultPollInterval()
    }
  )
}