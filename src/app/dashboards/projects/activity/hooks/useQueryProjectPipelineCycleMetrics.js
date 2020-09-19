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
                percentile_lead_time,
                avg_lead_time, 
                max_lead_time,
                percentile_cycle_time,
                avg_cycle_time,
                max_cycle_time,
                total_effort,
                avg_effort,
                max_effort,
                avg_duration,
                max_duration,
                percentile_duration,
                work_items_with_commits, 
                work_items_in_scope,
              ],
              defectsOnly: $defectsOnly,
              specsOnly: $specsOnly,
              leadTimeTargetPercentile: $leadTimeTargetPercentile,
              cycleTimeTargetPercentile: $cycleTimeTargetPercentile,
              durationTargetPercentile: $cycleTimeTargetPercentile,
            },
            referenceString: $referenceString
          ) {
          pipelineCycleMetrics {
              
                workItemsWithCommits
                workItemsInScope
              
                percentileLeadTime
                avgLeadTime
                maxLeadTime
                targetPercentile
                percentileCycleTime
                avgCycleTime
                maxCycleTime
                
              
                totalEffort
                avgEffort
                maxEffort
                percentileDuration
                avgDuration
                maxDuration
              
                
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